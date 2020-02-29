use rocket::response::NamedFile;
use rocket::State;

use crate::context::Context;

#[get("/preview/<id>", rank = 2)]
pub fn preview(context: State<Context>, id: String) -> Option<NamedFile> {
    if id.contains("..") {
        return None;
    }

    let preview_obj_path = format!("imports/{}/preview.obj", id);

    NamedFile::open(context.data_dir.join(preview_obj_path)).ok()
}
