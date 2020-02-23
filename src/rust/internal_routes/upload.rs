use rocket::Data;
use rocket::State;

use crate::context::Context;

#[post("/upload/<id>", data = "<file>", rank = 2)]
pub fn upload(context: State<Context>, id: String, file: Data) -> Result<(), &str> {
    // upload.single('blendfile')
    // destination: path.join(appDataDir, 'uploads'),
    //   callback(null, uuidV4() + path.extname(file.originalname));

    let mut command = context.blender_script_with_env("python/update.py");

    command.arg("--data-dir").arg(&context.data_dir);
    command.arg("--id").arg(&id);
    // command.arg("--blend").arg(&id)  upload path ?  //   arguments.push('--blend', request.file.path);

    match command.output() {
        Ok(output) => {
            if output.status.success() {
                Ok(())
                // Not sure if this applies here, was copied:
                // if context.data_dir.join(generate_file).exists() {
                //     Ok(())
                // } else {
                //     Err("TODO 500 + message".to_string())
                // }
            } else {
                //  `The spawned childprocess for blender_update.py failed\n\nArguments:\n${arguments.join('\n')}\n\nOutput:\n${output.join('\n')}`);
                Err("TODO 500 + message")
            }
        }
        Err(_) => Err("TODO 500 + message")
    }
}
