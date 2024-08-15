use std::collections::HashMap;
use std::fs;

use crate::compiler::html::compile_html;
use crate::compiler::js::compile_js;
use crate::compiler::util::copy_file;
use crate::io;

pub fn compile(input_dir: &str, output_dir: &str, config_map: &HashMap<String, String>) {
    // call compile_or_copy
    // handles error if input_dir does not exist
    // also creates output_dir if it does not exist
    compile_or_copy(input_dir, output_dir, config_map);
}

pub fn parse_config_file(path: &str) -> HashMap<String, String> {
    let config_data = match fs::read_to_string(path) {
        Ok(data) => data,
        Err(_) => {
            io::errndie(&format!("Could not read config file '{}'", path));
            String::new()
        }
    };

    let mut config_map: HashMap<String, String> = HashMap::new();

    for line in config_data.lines() {
        let parts: Vec<&str> = line.split('=').collect();
        if parts.len() != 2 {
            io::errndie(&format!("Invalid line in config file: '{}'", line));
            continue;
        }
        config_map.insert(parts[0].trim().to_string(), parts[1].trim().to_string());
    }

    config_map
}

fn compile_or_copy(input_dir: &str, output_dir: &str, config_map: &HashMap<String, String>) {
    // loop through all files/directories in input_dir
    // if file is a .js file, call compile_js(input_dir/file, output_dir/file)
    // if file is a .html file, call compile_html(input_dir/file, output_dir/file)
    // for any other file, call copy_file(input_dir/file, output_dir/file)
    // if file is a directory, call compile_or_copy(input_dir/file, output_dir/file)

    // task 0: check if input_dir exists
    if fs::metadata(input_dir).is_err() {
        io::errndie(&format!("Input directory '{}' does not exist", input_dir));
        return;
    }

    if config_map.contains_key("quiet") && config_map["quiet"] == "false" {
        println!("Entered {}", input_dir);
    }

    // task 1: read the contents of the input directory
    let entries = match fs::read_dir(input_dir) {
        Ok(entries) => entries,
        Err(_) => {
            io::errndie(&format!("Could not read directory '{}'", input_dir));
            return;
        }
    };

    // task 2: loop through all files/directories in input_dir
    for (entryno, entry) in entries.enumerate() {
        // task 2.1: get the entry or die
        let entry = match entry {
            Ok(entry) => entry,
            Err(_) => {
                io::errndie(&format!(
                    "Could not read entry {} of directory '{}'",
                    entryno, input_dir
                ));
                continue;
            }
        };

        // task 2.2: check if the entry is a directory
        if entry.file_type().unwrap().is_dir() {
            let input_subdir = format!("{}/{}", input_dir, entry.file_name().to_str().unwrap());
            let output_subdir = format!("{}/{}", output_dir, entry.file_name().to_str().unwrap());
            match fs::create_dir_all(&output_subdir) {
                Ok(_) => (),
                Err(_) => {
                    io::errndie(&format!("Could not create directory '{}'", output_subdir));
                    continue;
                }
            }
            // call compile_or_copy recursively
            compile_or_copy(&input_subdir, &output_subdir, config_map);
        }
        // task 2.3: check if the entry is a file
        else {
            let inpath = format!("{}/{}", input_dir, entry.file_name().to_str().unwrap());
            let outpath = format!("{}/{}", output_dir, entry.file_name().to_str().unwrap());

            // check if the outfile exists
            if fs::metadata(&outpath).is_ok() {
                // if outfile is newer than infile, skip
                let inmeta = fs::metadata(&inpath).unwrap();
                let outmeta = fs::metadata(&outpath).unwrap();
                if outmeta.modified().unwrap() > inmeta.modified().unwrap() {
                    continue;
                }
            }

            let compil_success;

            // for .js files
            if inpath.ends_with(".js") {
                let result = compile_js(&inpath, &outpath);
                if result.is_err() {
                    io::err(&format!("\nCould not compile '{}'", inpath));
                    io::err(&result.unwrap_err());
                    io::err("");
                    compil_success = false;
                } else {
                    compil_success = true;
                }
            }
            // for .html files
            else if inpath.ends_with(".html") {
                let result = compile_html(&inpath, &outpath);
                if result.is_err() {
                    io::err(&format!("\nCould not compile '{}'", inpath));
                    io::err(&result.unwrap_err());
                    io::err("");
                    compil_success = false;
                } else {
                    compil_success = true;
                }
            }
            // for any other file
            else {
                let result = copy_file(&inpath, &outpath);
                if result.is_err() {
                    io::err(&format!("\nCould not compile '{}'", inpath));
                    io::err(&result.unwrap_err());
                    io::err("");
                    compil_success = false;
                } else {
                    compil_success = true;
                }
            }

            // print some debug info if quiet is not set
            if compil_success && config_map.contains_key("quiet") && config_map["quiet"] == "false"
            {
                println!("Compiled {} -> {}", inpath, outpath);
            }
        }
    }
}
