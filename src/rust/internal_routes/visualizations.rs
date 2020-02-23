use rocket::State;
use rocket::response::status::NotFound;
use rocket_contrib::json::Json;
use serde_json;
use std::fs;
use std::path::Path;

use crate::context::Context;
use crate::meta::Meta;

#[derive(Serialize)]
pub struct Version {
    id: String,
    meta: Meta
}

#[derive(Serialize)]
pub struct Visualization {
    id: String,
    versions: Vec<Version>
}

#[get("/visualizations", rank = 2)]
pub fn visualizations(context: State<Context>) -> Result<Json<Vec<Visualization>>, NotFound<String>> {
    let visualizations_dir = context.data_dir.join("visualizations");

    match read_visualizations(visualizations_dir.as_path()) {
        Ok(visualizations) => Ok(Json(visualizations)),
        Err(err) => Err(NotFound(err))  // TODO: Could be 404 (dir missing) or 500 (corrupt visualization), maybe 404 should be 500 as well though, it's corrupt state in a way
    }
}

// TODO: Revisit exact handling of errors (e.g. possibly temporary read errors vs. definitive data integrity problems differentiation)

fn read_visualizations(directory: &Path) -> Result<Vec<Visualization>, String> {
    match directory.read_dir() {
        Ok(read_dir) => {
            let mut visualizations = vec![];

            for dir_entry_result in read_dir {
                match dir_entry_result {
                    Ok(dir_entry) => match read_versions(&dir_entry.path()) {
                        Ok(versions) => {
                            let visualization = Visualization {
                                id: dir_entry.file_name().into_string().unwrap(),
                                versions
                            };

                            visualizations.push(visualization);
                        }
                        Err(versions_err) => return Err(versions_err)
                    }
                    Err(_) => return Err("Could not read visualization directory.".to_string())
                }
            }

            Ok(visualizations)
        }
        Err(_) => return Err("Could not read visualizations directory.".to_string())
    }
}

fn read_versions(directory: &Path) -> Result<Vec<Version>, String> {
    match directory.read_dir() {
        Ok(read_dir) => {
            let mut versions = vec![];

            for dir_entry_result in read_dir {
                match dir_entry_result {
                    Ok(dir_entry) => match read_meta(&dir_entry.path()) {
                        Ok(meta) => {
                            let version = Version {
                                id: dir_entry.file_name().into_string().unwrap(),
                                meta
                            };

                            versions.push(version)
                        }
                        Err(meta_err) => return Err(meta_err)
                    }
                    Err(_) => return Err("Could not read version directory.".to_string())
                }
            }

            Ok(versions)
        }
        Err(_) => return Err("Could not read visualization directory.".to_string())
    }
}

fn read_meta(directory: &Path) -> Result<Meta, String> {
    match fs::read_to_string(directory.join("meta.json")) {
        Ok(meta_json) => {
            let meta: Meta = match serde_json::from_str(&meta_json) {
                Ok(meta) => meta,
                Err(_) => return Err("Could not deserialize meta.".to_string())
            };

            Ok(meta)
        }
        Err(_) => return Err("Could not read meta.".to_string())
    }
}
