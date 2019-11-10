use rocket::response::NamedFile;
use rocket::State;

use crate::context::Context;

// TODO: Sanitize path here and elsewhere

#[get("/preview/<id>", rank = 2)]
pub fn preview(context: State<Context>, id: String) -> Option<NamedFile> {
    let preview_obj_path = format!("imports/{}/preview.obj", id);

    NamedFile::open(context.data_dir.join(preview_obj_path)).ok()
}
