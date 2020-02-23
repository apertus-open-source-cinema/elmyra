#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate serde_derive;

use rocket::config::{Config, Environment};
use rocket_contrib::serve::StaticFiles;

mod context;
mod internal_routes;
mod library;
mod meta;
mod process;
mod public_routes;
mod renderer;

use context::Context;

#[cfg(debug_assertions)]
const ENVIRONMENT: Environment = Environment::Development;

#[cfg(not(debug_assertions))]
const ENVIRONMENT: Environment = Environment::Production;

fn main() {
    let context = Context::initialize();

    let config = Config::build(ENVIRONMENT)
                        .address("0.0.0.0")
                        .port(8080)  // TODO: CLI option for specifying port (and one for the address)
                        .finalize()
                        .unwrap();

    let internal_routes = routes![
        crate::internal_routes::generate::generate,
        crate::internal_routes::import::import_from_file,
        crate::internal_routes::import::import_from_url,
        crate::internal_routes::preview::preview,
        crate::internal_routes::upload::upload,
        crate::internal_routes::visualizations::visualizations
    ];

    let public_routes = routes![
        crate::public_routes::index::index,
        crate::public_routes::visualization::visualization,
        crate::public_routes::visualization::visualization_with_format
    ];

    let static_dir = context.runtime_dir.join("static");

    renderer::start(&context);  // TODO: CLI option to opt-in/out of running the renderer background process

    rocket::custom(config)
           .manage(context)
           .mount("/__static", StaticFiles::from(static_dir).rank(1))
           .mount("/__internal", internal_routes)
           .mount("/", public_routes)
           .launch();
}
