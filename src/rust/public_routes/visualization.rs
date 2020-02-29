use rocket::response::NamedFile;
use rocket::State;
use std::fs;

use crate::context::Context;
use crate::meta::Meta;

// TODO: Sanitize paths

#[get("/<id>/<version>", rank = 3)]
pub fn visualization(
    context: State<Context>,
    id: String,
    version: String
) -> Result<Option<NamedFile>, String> {
    serve_media(context, id, version, None)
}

#[get("/<id>/<version>/<format>", rank = 3)]
pub fn visualization_with_format(
    context: State<Context>,
    id: String,
    version: String,
    format: String
) -> Result<Option<NamedFile>, String> {
    serve_media(context, id, version, Some(&format))
}

fn serve_media(
    context: State<Context>,
    id: String,
    version: String,
    optional_format: Option<&str>
) -> Result<Option<NamedFile>, String> {
    if id.contains("..") || version.contains("..") {
        return Err("(o_ _)ﾉ彡☆");
    }

    if version == "latest" {
        match context.data_dir.join("visualizations").join(&id).read_dir() {
            Ok(read_dir) => {
                let mut versions = vec![];

                for dir_entry_result in read_dir {
                    match dir_entry_result {
                        Ok(dir_entry) => versions.push(dir_entry.file_name().into_string().unwrap()),
                        Err(_) => return Err("Could not read version directory.".to_string())
                    }
                }

                versions.sort();

                serve_version(context, id, versions.last().unwrap().to_string(), optional_format)
            }
            Err(_) => return Err("Could not read visualization directory.".to_string())
        }
    } else {
        serve_version(context, id, version, optional_format)
    }
}

fn serve_version(
    context: State<Context>,
    id: String,
    version: String,
    optional_format: Option<&str>
) -> Result<Option<NamedFile>, String> {
    match optional_format {
        Some(format) => match format {
            "thumbnail" => send_media(context, id, version, "thumbnail", "png", false),
            "blend" => send_media(context, id, version, "scene", "blend", true),
            "png" => send_media(context, id, version, "exported", "mp4", true),
            "jpg" => send_media(context, id, version, "exported", "jpg", true),
            "svg" => send_media(context, id, version, "exported", "svg", true),
            "mp4" => send_media(context, id, version, "exported", "mp4", true),
            "ogv" => send_media(context, id, version, "exported", "ogv", true),
            "webm" => send_media(context, id, version, "exported", "webm", true),
            "gif" => send_media(context, id, version, "exported", "gif", true),
            "png.zip" => send_media(context, id, version, "exported", "png.zip", true),
            "svg.zip" => send_media(context, id, version, "exported", "svg.zip", true),
            _ => return Err("Unknown format requested.".to_string())
        }
        None => {
            let meta_file = context.data_dir.join("visualizations").join(&id).join(&version).join("meta.json");

            match fs::read_to_string(meta_file) {
                Ok(meta_json) => {
                    let meta: Meta = match serde_json::from_str(&meta_json) {
                        Ok(meta) => meta,
                        Err(_) => return Err("Could not deserialize meta.".to_string())
                    };

                    if meta.media_animated {
                        send_media(context, id, version, "exported", "mp4", false)
                    } else {
                        send_media(context, id, version, "exported", "png", false)
                    }
                }
                Err(_) => return Err("Could not read meta.".to_string())
            }
        }
    }
}

fn send_media(
    context: State<Context>,
    id: String,
    version: String,
    base_name: &str,
    format: &str,
    download: bool
) -> Result<Option<NamedFile>, String> {
    let extended_name = format!("{}.{}", base_name, format);
    let file = context.data_dir.join("visualizations").join(&id).join(&version).join(extended_name);

    if download {
        // TODO: Send with content disposition download filename header thingy
        let _download_filename = format!("{}.{}", id, format);

        Ok(NamedFile::open(file).ok())
    } else {
        Ok(NamedFile::open(file).ok())
    }
}
