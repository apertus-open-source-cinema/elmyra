use clap::{arg_enum, Clap};

arg_enum! {
    #[derive(Debug)]
    pub enum RenderDevice {
        Cpu,
        Gpu
    }
}

impl RenderDevice {
    pub fn to_str(&self) -> &str {
        match self {
            Self::Cpu => "CPU",
            Self::Gpu => "GPU"
        }
    }
}

#[clap(version = env!("CARGO_PKG_VERSION"))]
#[derive(Clap, Debug)]
pub struct Args {

    /// Which address to listen on.
    #[clap(default_value = "0.0.0.0", long = "address", short = "a")]
    pub address: String,

    /// By default elmyra uses a bundled version of blender (strongly recommended), you can override it with this if you know what you're doing or if would like to play and learn.
    #[clap(long = "blender-path")]
    pub blender_path: Option<String>,

    /// The directory to store visualization files and rendered material in, by default elmyra's runtime directory (= the one where the executable and bundled resources are located) is used.
    #[clap(long = "data-dir")]
    pub data_dir: Option<String>,

    /// By default elmyra runs a renderer process in the background, this option disables it.
    #[clap(long = "disable-rendering")]
    pub disable_rendering: bool,

    /// By default elmyra uses a bundled version of ffmpeg (strongly recommended), you can override it with this if you know what you're doing or if you would like to play and learn.
    #[clap(long = "ffmpeg-path")]
    pub ffmpeg_path: Option<String>,

    /// Which port to listen on.
    #[clap(default_value = "8080", short = "p", long = "port")]
    pub port: u16,

    /// Customize which computing device the renderer should use, that is: CPU or GPU
    #[clap(case_insensitive = true, default_value = "CPU", long = "render-device", possible_values = &RenderDevice::variants())]
    pub render_device: RenderDevice,

    /// Customize how many seconds the renderer should spend on each visualization (they are rendered in turns) - note that this is a mininum suggestion: if a single rendering action takes longer than the target time, the renderer only moves to the next visualization when the action has completed.
    #[clap(default_value = "60", long = "render-target-time")]
    pub render_target_time: usize

}
