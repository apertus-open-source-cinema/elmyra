use rocket::response::NamedFile;
use rocket::State;

use crate::context::Context;

#[get("/", rank = 1)]
pub fn index(context: State<Context>) -> Option<NamedFile> {
    let index_html = context.runtime_dir.join("static/index.html");

    NamedFile::open(index_html).ok()
}
