# Specifications for bundled dependencies in `lib/`

The officially maintained library bundle is available at https://files.apertus.org/elmyra/elmyra-lib.zip

## Platform dependencies (blender, ffmpeg)

**The paths to the dependencies' executables need to be updated in the `src/[platform]/paths.json` manifests for every update!**

### Blender 2.80

Blender can be bundled as-is except for one critical manual tweak, namely isolating its runtime environment from any user/system blender that might be installed on the machine where elmyra runs.
For this simply create an empty `config/` folder in blender's `2.80/` directory. (see [Q/A on Blender Stackexchange](https://blender.stackexchange.com/questions/48392/make-blender-unaware-of-user-system-installed-add-ons))

### FFmpeg 4.2.1+ or recent snapshot build from git

This refers to the executables (`ffmpeg`, `ffplay`, etc. though only `ffmpeg` itself is needed) and not to the `libav*` C libraries.

## Asset dependencies

These are the blender files and image/font file assets Elmyra imports when it generates or updates visualizations. They are located inside `lib/elmyra/` and documented here for overview and development reference purposes.

- `environment.hdr`
- `illustrated.blend`
- `preview-widgets.blend`
- `realistic.blend`
- `section.blend`
