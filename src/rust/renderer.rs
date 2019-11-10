use std::process::{Command, Stdio};

use crate::context::Context;

pub fn start(context: &Context) {
    let mut command = Command::new(&context.blender_executable);

    // TODO: With these in place the renderer does not do anything, investigate
    // command.stderr(Stdio::piped());
    // command.stdout(Stdio::piped());

    command.env("ELMYRA_FFMPEG_EXECUTABLE", &context.ffmpeg_executable);
    command.arg("--background");
    command.arg("--python").arg(context.runtime_dir.join("python/renderer.py"));
    command.arg("--");
    command.arg("--data-dir").arg(&context.data_dir);
    command.arg("--device").arg("CPU");  // TODO: CLI option to toggle between CPU/GPU
    command.arg("--target-time").arg(60.to_string());  // TODO: CLI option to specify target render time

    match command.spawn() {
        Ok(_) => (),
        Err(err) => panic!("Could not spawn renderer process: {}", err)
    }
}
