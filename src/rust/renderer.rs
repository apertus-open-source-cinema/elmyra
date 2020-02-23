// use std::process::Stdio;

use crate::args::Args;
use crate::context::Context;

pub fn start(args: &Args, context: &Context) {
    let mut command = context.blender_script_with_env("python/renderer.py");

    // TODO: With these in place the renderer does not do anything, investigate
    // command.stderr(Stdio::piped());
    // command.stdout(Stdio::piped());

    command.arg("--device").arg(args.render_device.to_str());
    command.arg("--target-time").arg(args.render_target_time.to_string());

    match command.spawn() {
        Ok(_) => (),
        Err(err) => panic!("Could not spawn renderer process: {}", err)
    }
}
