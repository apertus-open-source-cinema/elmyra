#[macro_use] extern crate serde_derive;

use std::fs;

#[derive(Deserialize)]
struct Paths {
    pub blender: String,
    pub ffmpeg: String
}

#[cfg(target_os = "linux")]
pub const PATHS_JSON: &str = "lib/linux/paths.json";

#[cfg(target_os = "macos")]
pub const PATHS_JSON: &str = "lib/macos/paths.json";

#[cfg(target_os = "windows")]
pub const PATHS_JSON: &str = "lib/windows/paths.json";


fn main() {
    let paths_json = fs::read_to_string(PATHS_JSON).unwrap();
    let paths: Paths = serde_json::from_str(&paths_json).unwrap();

    let library_rs = vec![
        format!("pub const BLENDER: &str = \"{}\";", paths.blender),
        format!("pub const FFMPEG: &str = \"{}\";", paths.ffmpeg)
    ].join("\n");

    fs::write("src/rust/library.rs", library_rs).unwrap();
}
