use rocket::State;
use rocket_contrib::json::Json;

use crate::context::Context;
use crate::process;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Parameters {
    pub camera_type: String,
    pub id: String,
    pub import_id: String,
    pub media_animated: bool,
    pub media_height: usize,
    pub media_length: Option<usize>,
    pub media_width: usize,
    pub modifier_section_axis: Option<String>,
    pub modifier_section_level: Option<f32>,
    pub modifier_section_level_from: Option<f32>,
    pub modifier_section_level_to: Option<f32>,
    pub modifier_type: String,
    pub orient_flip_horizontally: bool,
    pub orient_flip_vertically: bool,
    pub orient_rotate_x: f32,
    pub orient_rotate_y: f32,
    pub orient_rotate_z: f32,
    pub style_type: String
}

#[post("/generate", data = "<parameters>", rank = 2)]
pub fn generate(context: State<Context>, parameters: Json<Parameters>) -> Result<(), String> {
    let mut command = context.blender_script_with_env("python/generate.py");

    command.arg("--id").arg(&parameters.id);
    command.arg("--import-id").arg(&parameters.import_id);
    command.arg("--media-animated").arg(if parameters.media_animated { "true" } else { "false" });
    command.arg("--media-height").arg(parameters.media_height.to_string());
    if let Some(length) = parameters.media_length { command.arg("--media-length").arg(length.to_string()); }
    command.arg("--media-width").arg(parameters.media_width.to_string());
    if let Some(ref axis) = parameters.modifier_section_axis { command.arg("--modifier-section-axis").arg(axis); }
    if let Some(level) = parameters.modifier_section_level { command.arg("--modifier-section-level").arg(level.to_string()); }
    if let Some(level_from) = parameters.modifier_section_level_from { command.arg("--modifier-section-level-from").arg(level_from.to_string()); }
    if let Some(level_to) = parameters.modifier_section_level_to { command.arg("--modifier-section-level-to").arg(level_to.to_string()); }
    command.arg("--modifier-type").arg(&parameters.modifier_type);
    command.arg("--orient-flip-horizontally").arg(if parameters.orient_flip_horizontally { "true" } else { "false" });
    command.arg("--orient-flip-vertically").arg(if parameters.orient_flip_vertically { "true" } else { "false" });
    command.arg("--orient-rotate-x").arg(parameters.orient_rotate_x.to_string());
    command.arg("--orient-rotate-y").arg(parameters.orient_rotate_y.to_string());
    command.arg("--orient-rotate-z").arg(parameters.orient_rotate_z.to_string());
    command.arg("--style-type").arg(&parameters.style_type);
    command.arg("--camera-type").arg(&parameters.camera_type);

    match command.output() {
        Ok(output) => if output.status.success() {
            Ok(())
        } else {
            let blender_output = process::debug_output(output);
            Err(format!("The blender child process returned an error exit code.\n\n{}", blender_output))
        }
        Err(_) => Err("The blender child process could not be executed.".to_string())
    }
}
