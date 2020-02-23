use clap::Clap;

#[derive(Clap, Debug)]
pub struct Args {

    /// By default elmyra runs a renderer process in the background, this option disables it.
    #[clap(long = "disable-rendering")]
    pub disable_rendering: bool,

}
