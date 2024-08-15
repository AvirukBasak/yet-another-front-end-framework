use std::process::exit;
use crate::errcodes;

pub fn err(msg: &str) {
    eprintln!("YAFF0: {}", msg);
}

pub fn errndie(msg: &str) {
    eprintln!("YAFF0: Error: {}", msg);
    exit(errcodes::EXIT_FAILURE);
}
