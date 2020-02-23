#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FormatMeta {
    pub file_path: String,
    pub exported: String,
    pub processing_time: f32,
    pub file_size: usize
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Meta {
    pub media_width: usize,
    pub media_height: usize,
    pub media_length: usize,
    pub media_animated: bool,
    pub media_fps: usize,
    pub media_frame_count: usize,
    pub processing: Option<String>,
    pub render_device: Option<String>,
    pub last_rendered_frame: Option<usize>,
    pub last_render_duration: Option<f32>,
    pub last_render: Option<String>,
    pub last_rendered_samples: Option<usize>,
    pub mp4: Option<FormatMeta>,
    pub ogv: Option<FormatMeta>,
    pub webm: Option<FormatMeta>,
    pub gif: Option<FormatMeta>,
    pub jpg: Option<FormatMeta>,
    pub png: Option<FormatMeta>,
    pub svg: Option<FormatMeta>,
    #[serde(rename = "png.zip")]
    pub png_zip: Option<FormatMeta>,
    #[serde(rename = "svg.zip")]
    pub svg_zip: Option<FormatMeta>
}
