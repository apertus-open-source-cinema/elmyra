use rocket::Data;
use rocket::State;

use crate::context::Context;
use crate::process;
use crate::uuid;

#[post("/upload/<id>", data = "<file>", rank = 2)]
pub fn upload(context: State<Context>, id: String, file: Data) -> Result<(), String> {
    let upload_id = uuid::generate();
    let upload_path = format!("upload/{}.blend", upload_id);

    match file.stream_to_file(context.data_dir.join(&upload_path)) {
        Ok(_) => update(context, id, upload_id),
        Err(_) => Err("The update file upload could not be written to disk.".to_string())
    }
}

fn update(
    context: State<Context>,
    id: String,
    upload_id: String
) -> Result<(), String> {
    let mut command = context.blender_script_with_env("python/update.py");

    command.arg("--id").arg(&id);
    command.arg("--upload-id").arg(&upload_id);

    match command.output() {
        Ok(output) => {
            if output.status.success() {
                Ok(())
            } else {
                let blender_output = process::debug_output(output);
                Err(format!("The blender child process returned an error exit code.\n\n{}", blender_output))
            }
        }
        Err(_) => Err("The blender child process could not be executed.".to_string())
    }
}
