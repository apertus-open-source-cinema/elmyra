use rocket::response::NamedFile;
use rocket::State;
use std::path::Path;

use crate::context::Context;

#[allow(non_snake_case)]
pub struct Meta {
    mediaAnimated: bool
}

// "mediaWidth": bpy.context.scene.render.resolution_x,
// "mediaHeight": bpy.context.scene.render.resolution_y,
// "mediaLength":  media_length,
// "mediaAnimated": media_animated,
// "mediaFps": bpy.context.scene.render.fps,
// "mediaFrameCount": bpy.context.scene.frame_end

// TODO: format checking as in import.rs

#[get("/<id>/<version>", rank = 3)]
pub fn visualization(
    context: State<Context>,
    id: String,
    version: String
) -> Result<String, String> {
    serve_media(context.data_dir.as_path(), &id, &version, None)
}

#[get("/<id>/<version>/<format>", rank = 3)]
pub fn visualization_with_format(
    context: State<Context>,
    id: String,
    version: String,
    format: String
) -> Result<String, String> {
    serve_media(context.data_dir.as_path(), &id, &version, Some(&format))
}

fn serve_media(
    data_dir: &Path,
    id: &str,
    version: &str,
    optional_format: Option<&str>
) -> Result<String, String> {
    let visualizations_dir = data_dir.join("visualizations").join(id);

    if version == "latest" {
        let determined_version_mock = "1234";
        // TODO: get version directories
        //     fs.readdir(vizPath, (err, verDirs) => {
        //       serveVersion(verDirs.sort()[verDirs.length - 1]);
        //     });
        serve_version(data_dir, id, determined_version_mock, optional_format)
    } else {
        serve_version(data_dir, id, version, optional_format)
    }
}

fn serve_version(
    data_dir: &Path,
    id: &str,
    version: &str,
    optional_format: Option<&str>
) -> Result<String, String> {
    match optional_format {
        Some(format) => match format {
            "thumbnail" => send_media("thumbnail.png".to_string(), None),
            "blend" => send_media("scene.blend".to_string(), Some("{id}.blend".to_string())),
            _ => send_media("exported.{format}".to_string(), Some("{id}.{format}".to_string()))
        }
        None => {
            // const metaPath = path.join(vizPath, version, 'meta.json');
            // fs.readFile(metaPath, (err, data) => {

            // TODO: Elsewhere in the system meta.mediaType is used, whereas now we reduce down to just is_animation - adapt
            let mock_meta = Meta { mediaAnimated: true }; //   const meta = JSON.parse(data);

            if mock_meta.mediaAnimated {
                send_media("exported.mp4".to_string(), None)
            } else {
                send_media("exported.png".to_string(), None)
            }
        }
    }
}

fn send_media(filename: String, download_filename: Option<String>) -> Result<String, String> {
    //       const filePath = path.join(vizPath, version, filename);
    //
    //       fs.access(filePath, fs.F_OK, err => {
    //         if(err) {
    //           sendStatus(404)
    //         } else {
    match download_filename {
        Some(filename) => Ok("TODO".to_string()),  // (response. ?)download(filePath, download_filename)
        None => Ok("TODO".to_string()) // (response. ?)sendFile(filePath)
    }
    //         }
    //       });
}
