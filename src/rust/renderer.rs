use log::{debug, error};
use std::{thread, time::Duration};

use crate::args::Args;
use crate::context::Context;
use crate::process;

pub fn start(args: Args, context: Context) {
    thread::spawn(move || {
        let visualizations_dir = context.data_dir.join("visualizations");

        loop {
            match visualizations_dir.read_dir() {
                Ok(read_dir) => {
                    for dir_entry_result in read_dir {
                        match dir_entry_result {
                            Ok(dir_entry) => {
                                let mut command = context.blender_script_with_env("python/render.py");

                                command.arg("--id").arg(dir_entry.file_name().into_string().unwrap());
                                command.arg("--device").arg(args.render_device.to_str());
                                command.arg("--target-time").arg(args.render_target_time.to_string());

                                match command.output() {
                                    Ok(output) => if output.status.success() {
                                        debug!("The blender child process finished");
                                    } else {
                                        let blender_output = process::debug_output(output);
                                        error!("The blender child process returned an error exit code.\n\n{}", blender_output)
                                    }
                                    Err(_) => error!("The blender child process could not be executed.")
                                }
                            }
                            Err(_) => debug!("Could not read visualization directory.")
                        }
                    }
                }
                Err(_) => debug!("Could not read visualizations directory.")
            }

            thread::sleep(Duration::from_secs(1))
        }
    });
}
