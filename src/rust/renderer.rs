// use std::process::Stdio;

use crate::context::Context;

pub fn start(context: &Context) {
    let mut command = context.blender_script_with_env("python/renderer.py");

    // TODO: With these in place the renderer does not do anything, investigate
    // command.stderr(Stdio::piped());
    // command.stdout(Stdio::piped());

    command.arg("--data-dir").arg(&context.data_dir);
    command.arg("--device").arg("CPU");  // TODO: CLI option to toggle between CPU/GPU
    command.arg("--target-time").arg(60.to_string());  // TODO: CLI option to specify target render time

    match command.spawn() {
        Ok(_) => (),
        Err(err) => panic!("Could not spawn renderer process: {}", err)
    }
}
