use rocket::Data;
use rocket::State;
use rocket::request::Form;
use rocket_contrib::json::Json;
use uuid::Uuid;

use crate::process;
use crate::context::Context;

const SUPPORTED_FORMATS: &[&str] = &[
    "3ds",
    "blend",
    "dae",
    "fbx",
    "obj",
    "ply",
    "stl"
];

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportResponse {
    import_id: String
}

#[derive(FromForm)]
pub struct ImportUrlFormData {
    pub url: String
}

#[post("/import/file/<format>", data = "<file>", rank = 2)]
pub fn import_from_file(
    context: State<Context>,
    file: Data,
    format: String
) -> Result<Json<ImportResponse>, String> {
    if !SUPPORTED_FORMATS.contains(&format.as_str()) {
        return Err("The supplied file format is not supported.".to_string());
    }

    let import_id = generate_import_id();
    let upload_path = format!("upload/{}.{}", import_id, format);

    match file.stream_to_file(context.data_dir.join(&upload_path)) {
        Ok(_) => import(context, import_id, format, upload_path),
        Err(_) => Err("The import file upload could not be written to disk.".to_string())
    }
}

#[post("/import/url/<format>", data = "<form>", rank = 2)]
pub fn import_from_url(
    context: State<Context>,
    form: Form<ImportUrlFormData>,
    format: String
) -> Result<Json<ImportResponse>, String> {
    if !SUPPORTED_FORMATS.contains(&format.as_str()) {
        return Err("The supplied file format is not supported.".to_string());
    }

    import(context, generate_import_id(), format, form.url.clone())
}

fn generate_import_id() -> String {
    Uuid::new_v4().to_simple().to_string()
}

fn import(
    context: State<Context>,
    import_id: String,
    format: String,
    url: String
) -> Result<Json<ImportResponse>, String> {
    let mut command = context.blender_script_with_env("python/import.py");

    command.arg("--url").arg(&url);
    command.arg("--format").arg(&format);
    command.arg("--import-id").arg(&import_id);

    let import_file = format!("imports/{}/imported.blend", import_id);

    match command.output() {
        Ok(output) => {
            if output.status.success() {
                if context.data_dir.join(import_file).exists() {
                    Ok(Json(ImportResponse { import_id: import_id }))
                } else {
                    let blender_output = process::debug_output(output);
                    Err(format!("The blender child process did not produce the required output.\n\n{}", blender_output))
                }
            } else {
                let blender_output = process::debug_output(output);
                Err(format!("The blender child process returned an error exit code.\n\n{}", blender_output))
            }
        }
        Err(_) => Err("The blender child process could not be executed.".to_string())
    }
}
