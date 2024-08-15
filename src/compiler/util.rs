use std::fs;

pub fn copy_file(inpath: &str, outpath: &str) -> Result<u64, String> {
    let result = fs::copy(inpath, outpath);
    match result {
        Ok(_) => Ok(result.unwrap()),
        Err(err) => Err(format!("Could not copy file '{}' to {}", inpath, err)),
    }
}
