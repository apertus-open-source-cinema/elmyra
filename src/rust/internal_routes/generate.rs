use rocket::State;
use rocket_contrib::json::Json;

use crate::context::Context;
use crate::process;

#[allow(non_snake_case)]
#[derive(Deserialize)]
pub struct Parameters {
    pub cameraType: String,
    pub id: String,
    pub importId: String,
    pub mediaAnimated: bool,
    pub mediaHeight: usize,
    pub mediaLength: Option<usize>,
    pub mediaWidth: usize,
    pub modifierSectionAxis: Option<String>,
    pub modifierSectionLevel: Option<f32>,
    pub modifierSectionLevelFrom: Option<f32>,
    pub modifierSectionLevelTo: Option<f32>,
    pub modifierType: String,
    pub orientFlipHorizontally: bool,
    pub orientFlipVertically: bool,
    pub orientRotateX: f32,
    pub orientRotateY: f32,
    pub orientRotateZ: f32,
    pub styleType: String
}

#[post("/generate", data = "<parameters>", rank = 2)]
pub fn generate(context: State<Context>, parameters: Json<Parameters>) -> Result<(), String> {
    let mut command = context.blender_script_with_env("python/generate.py");

    command.arg("--id").arg(&parameters.id);
    command.arg("--import-id").arg(&parameters.importId);
    command.arg("--data-dir").arg(&context.data_dir);
    command.arg("--media-animated").arg(if parameters.mediaAnimated { "true" } else { "false" });
    command.arg("--media-height").arg(parameters.mediaHeight.to_string());
    if let Some(length) = parameters.mediaLength { command.arg("--media-length").arg(length.to_string()); }
    command.arg("--media-width").arg(parameters.mediaWidth.to_string());
    if let Some(ref axis) = parameters.modifierSectionAxis { command.arg("--modifier-section-axis").arg(axis); }
    if let Some(level) = parameters.modifierSectionLevel { command.arg("--modifier-section-level").arg(level.to_string()); }
    if let Some(level_from) = parameters.modifierSectionLevelFrom { command.arg("--modifier-section-level-from").arg(level_from.to_string()); }
    if let Some(level_to) = parameters.modifierSectionLevelTo { command.arg("--modifier-section-level-to").arg(level_to.to_string()); }
    command.arg("--modifier-type").arg(&parameters.modifierType);
    command.arg("--orient-flip-horizontally").arg(if parameters.orientFlipHorizontally { "true" } else { "false" });
    command.arg("--orient-flip-vertically").arg(if parameters.orientFlipVertically { "true" } else { "false" });
    command.arg("--orient-rotate-x").arg(parameters.orientRotateX.to_string());
    command.arg("--orient-rotate-y").arg(parameters.orientRotateY.to_string());
    command.arg("--orient-rotate-z").arg(parameters.orientRotateZ.to_string());
    command.arg("--style-type").arg(&parameters.styleType);
    command.arg("--camera-type").arg(&parameters.cameraType);

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
