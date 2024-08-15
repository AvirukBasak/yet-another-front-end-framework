pub mod compiler;
pub mod errcodes;
pub mod globals;
pub mod io;

// get args from command line
use std::collections::HashMap;
use std::{env, process::exit};

use io::errndie;

fn printhelp() {
    println!("Usage:");
    println!("  {} [options] <inputDir> <outputDir>\n", env::args().nth(0).unwrap());
    println!("Options:");
    println!("  -h, --help      Display this message");
    println!("  -v, --version   Display version");
    println!("  -q, --quiet     Suppress non-error output");
    println!("  -c, --config    Specify a config file\n");
    println!("Notes:");
    println!("  - If no config file is provided, default values will be used");
    println!("  - Options should be provided in same order as the help list");
    println!("  - Config file overrides any options provided in the command line");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() == 1 {
        printhelp();
        io::errndie("No arguments provided");
    }

    // start from 1 because the first arg is the name of the program
    let mut index = 1;
    let mut config_map: HashMap<String, String> = HashMap::new();

    // set quiet to false by default
    config_map.insert("quiet".to_string(), "false".to_string());

    if args[index] == "-h" || args[index] == "--help" {
        printhelp();
        exit(errcodes::EXIT_SUCCESS);
    }

    if args[index] == "-v" || args[index] == "--version" {
        println!("YAFF0 Version {}", globals::VERSION);
        println!("License: {}", globals::LICENSE);
        println!("Authors: {}", globals::AUTHORS);
        exit(errcodes::EXIT_SUCCESS);
    }

    if args[index] == "-q" || args[index] == "--quiet" {
        index += 1;
        config_map.insert("quiet".to_string(), "true".to_string());
    }

    if args[index] == "-c" || args[index] == "--config" {
        index += 1;
        if args.len() <= index {
            errndie("No config file provided");
        }
        config_map = compiler::parse_config_file(&args[index]);
        index += 1;
    }

    if index + 1 >= args.len() {
        printhelp();
        errndie("Missing input or output directory");
    }

    let input_dir = &args[index];
    let output_dir = &args[index + 1];

    compiler::compile(input_dir, output_dir, &config_map);
}
