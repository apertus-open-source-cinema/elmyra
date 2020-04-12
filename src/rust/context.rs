//! Determines the data and executable directories used to read and write resources
//! based on the process environment context and/or optional command line arguments.
//! Also creates necessary directories within the data directory if they don't exist.

use std::{
    env,
    fs,
    path::PathBuf,
    process::Command
};

use crate::args::Args;
use crate::library;

#[derive(Clone)]
pub struct Context {
    blender_executable: PathBuf,
    pub data_dir: PathBuf,
    ffmpeg_executable: PathBuf,
    pub runtime_dir: PathBuf
}

impl Context {
    pub fn initialize(args: &Args) -> Context {
        let runtime_dir = match process_path::get_executable_path() {
            Some(path) => path.parent().unwrap().to_path_buf(),
            None => match env::current_dir() {
                Ok(path) => {
                    println!(
                        "The runtime directory could not be determined and \
                         the current working directory is instead assumed \
                         to be the runtime directory. If you didn't start \
                         the elmyra binary from its containing folder, you \
                         should quit now and start it from there instead, \
                         otherwise you will run into undefined behavior."
                    );

                    path
                }
                Err(_) => {
                    panic!(
                        "The runtime directory could not be determined and \
                         the current working directory is invalid. Please \
                         make sure to execute the elmyra binary from its \
                         containing folder."
                    );
                }
            }
        };


        let data_dir = match &args.data_dir {
            Some(path) => PathBuf::from(path),
            None => runtime_dir.to_path_buf()
        };

        for (dir, disposable_content) in &[
            ("imports", true),
            ("upload", true),
            ("visualizations", false)
        ] {
            let required_dir = data_dir.join(dir);

            if required_dir.is_dir() {
                if *disposable_content {
                    fs::remove_dir_all(&required_dir).ok();
                } else {
                    continue
                }
            }

            if let Err(err) = fs::create_dir(required_dir) {
                panic!("Could not create the required '{}' directory inside the data directory {}, received error: {}", dir, data_dir.display(), err)
            }
        }

        let blender_executable = match &args.blender_path {
            Some(path) => PathBuf::from(path),
            None => runtime_dir.join(library::BLENDER)
        };

        let ffmpeg_executable = match &args.ffmpeg_path {
            Some(path) => PathBuf::from(path),
            None => runtime_dir.join(library::FFMPEG)
        };

        Context {
            blender_executable,
            data_dir,
            ffmpeg_executable,
            runtime_dir
        }
    }

    pub fn blender_script_with_env(&self, script: &str) -> Command {
        let mut command = Command::new(&self.blender_executable);

        command.env("ELMYRA_DATA_DIR", &self.data_dir);
        command.env("ELMYRA_FFMPEG_EXECUTABLE", &self.ffmpeg_executable);
        command.env("ELMYRA_RUNTIME_DIR", &self.runtime_dir);

        command.arg("--background");
        command.arg("--python").arg(self.runtime_dir.join(script));
        command.arg("--");

        command
    }
}
