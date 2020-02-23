use rocket::response::NamedFile;
use rocket::State;
use std::fs;
use std::path::PathBuf;

use crate::context::Context;
use crate::meta::Meta;

// TODO: format checking as in import.rs
// TODO: Sanitize paths

#[get("/<id>/<version>", rank = 3)]
pub fn visualization(
    context: State<Context>,
    id: String,
    version: String
) -> Result<Option<NamedFile>, String> {
    serve_media(context.data_dir.join("visualizations").join(id), &version, None)
}

#[get("/<id>/<version>/<format>", rank = 3)]
pub fn visualization_with_format(
    context: State<Context>,
    id: String,
    version: String,
    format: String
) -> Result<Option<NamedFile>, String> {
    serve_media(context.data_dir.join("visualizations").join(id), &version, Some(&format))
}

fn serve_media(
    visualization_dir: PathBuf,
    version: &str,
    optional_format: Option<&str>
) -> Result<Option<NamedFile>, String> {
    if version == "latest" {
        match visualization_dir.read_dir() {
            Ok(read_dir) => {
                let mut versions = vec![];

                for dir_entry_result in read_dir {
                    match dir_entry_result {
                        Ok(dir_entry) => versions.push(dir_entry.file_name().into_string().unwrap()),
                        Err(_) => return Err("Could not read version directory.".to_string())
                    }
                }

                versions.sort();

                serve_version(visualization_dir.join(versions.last().unwrap()), optional_format)
            }
            Err(_) => return Err("Could not read visualization directory.".to_string())
        }
    } else {
        serve_version(visualization_dir.join(version), optional_format)
    }
}

fn serve_version(
    version_dir: PathBuf,
    optional_format: Option<&str>
) -> Result<Option<NamedFile>, String> {
    match optional_format {
        Some(format) => match format {
            "thumbnail" => send_media(version_dir.join("thumbnail.png"), None),
            "blend" => send_media(version_dir.join("scene.blend"), Some("{id}.blend".to_string())),
            _ => send_media(version_dir.join("exported.{format}"), Some("{id}.{format}".to_string()))  // TODO: Consider hardcoding all options
        }
        None => {
            match fs::read_to_string(version_dir.join("meta.json")) {
                Ok(meta_json) => {
                    let meta: Meta = match serde_json::from_str(&meta_json) {
                        Ok(meta) => meta,
                        Err(_) => return Err("Could not deserialize meta.".to_string())
                    };

                    if meta.media_animated {
                        send_media(version_dir.join("exported.mp4"), None)
                    } else {
                        send_media(version_dir.join("exported.png"), None)
                    }
                }
                Err(_) => return Err("Could not read meta.".to_string())
            }
        }
    }
}

fn send_media(file: PathBuf, download_filename: Option<String>) -> Result<Option<NamedFile>, String> {
    dbg!(&file);

    match download_filename {
        Some(download_filename) => Ok(NamedFile::open(file).ok()),  // TODO: Send with content disposition download filename header thingy
        None => Ok(NamedFile::open(file).ok())
    }
}
