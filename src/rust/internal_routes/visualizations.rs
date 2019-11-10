use rocket::State;
use rocket::response::status::NotFound;
use rocket_contrib::json::Json;
use serde_json;
use std::fs;
use std::path::Path;

use crate::context::Context;

#[allow(non_snake_case)]
#[derive(Deserialize)]
pub struct Meta {
    pub mediaWidth: usize,
    pub mediaHeight: usize,
    pub mediaLength: usize,
    pub mediaAnimated: bool,
    pub mediaFps: usize,
    pub mediaFrameCount: usize,
    pub processing: String,
    pub renderDevice: String,
    pub lastRenderedFrame: usize,
    pub lastRenderDuration: f32,
    pub lastRender: String,
    pub lastRenderedSamples: usize
}

#[allow(non_snake_case)]
#[derive(Serialize)]
pub struct Version {
    id: String,
    mediaWidth: usize,
    mediaHeight: usize,
    mediaLength: usize,
    mediaAnimated: bool,
    mediaFps: usize,
    mediaFrameCount: usize,
    processing: String,
    renderDevice: String,
    lastRenderedFrame: usize,
    lastRenderDuration: f32,
    lastRender: String,
    lastRenderedSamples: usize,
    version: String
}

type Visualization = Vec<Version>;
type Visualizations = Vec<Visualization>;

#[get("/visualizations", rank = 2)]
pub fn visualizations(context: State<Context>) -> Result<Json<Visualizations>, NotFound<String>> {
    let visualizations_dir = context.data_dir.join("visualizations");

    match read_visualizations(visualizations_dir.as_path()) {
        Ok(visualizations) => Ok(Json(visualizations)),
        Err(err) => Err(NotFound(err))  // TODO: Could be 404 (dir missing) or 500 (corrupt visualization), maybe 404 should be 500 as well though, it's corrupt state in a way
    }
}

// TODO: Revisit exact handling of errors (e.g. possibly temporary read errors vs. definitive data integrity problems differentiation)

fn read_visualizations(directory: &Path) -> Result<Visualizations, String> {
    match directory.read_dir() {
        Ok(read_dir) => Ok(read_dir.filter_map(|dir_entry_result| {
            match dir_entry_result {
                Ok(dir_entry) => match read_versions(&dir_entry.path()) {
                    Ok(visualization) => Some(visualization),
                    Err(_) => None
                }
                Err(_) => None
            }
        }).collect()),
        Err(_) => return Err("Could not read visualizations directory.".to_string())
    }
}

fn read_versions(directory: &Path) -> Result<Visualization, String> {
    match directory.read_dir() {
        Ok(read_dir) => Ok(read_dir.filter_map(|dir_entry_result| {
            match dir_entry_result {
                Ok(dir_entry) => match read_meta(&dir_entry.path()) {
                    Ok(meta) => Some(meta),
                    Err(_) => None
                }
                Err(_) => None
            }
        }).collect()),
        Err(_) => return Err("Could not read visualization directory.".to_string())
    }
}

fn read_meta(directory: &Path) -> Result<Version, String> {
    match fs::read_to_string(directory.join("meta.json")) {
        Ok(meta_json) => {
            let meta: Meta = match serde_json::from_str(&meta_json) {
                Ok(meta) => meta,
                Err(_) => return Err("Could not deserialize meta.".to_string())
            };

            Ok(Version {
                id: directory.parent().unwrap().file_name().unwrap().to_str().unwrap().to_string(),
                mediaWidth: meta.mediaWidth,
                mediaHeight: meta.mediaHeight,
                mediaLength: meta.mediaLength,
                mediaAnimated: meta.mediaAnimated,
                mediaFps: meta.mediaFps,
                mediaFrameCount: meta.mediaFrameCount,
                processing: meta.processing,
                renderDevice: meta.renderDevice,
                lastRenderedFrame: meta.lastRenderedFrame,
                lastRenderDuration: meta.lastRenderDuration,
                lastRender: meta.lastRender,
                lastRenderedSamples: meta.lastRenderedSamples,
                version: directory.file_name().unwrap().to_str().unwrap().to_string()
            })
        }
        Err(_) => return Err("Could not read meta.".to_string())
    }
}
