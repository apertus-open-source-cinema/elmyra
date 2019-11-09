# Specifications for bundled dependencies in `lib/`

The officially maintained library bundle is available at https://files.apertus.org/elmyra/elmyra-lib.zip

## Platform dependencies (blender, ffmpeg)

**The paths to the dependencies' executables need to be updated in the launchers and library modules located under `src/[platform]` for every update!**

### Blender 2.8

#### Additional Python packages

The blender python environment needs an additional package installed:

- `natsort`

This package goes into:

- `2.80/python/lib/python3.7/site-packages/` (Linux)
- `Contents/Resources/2.80/python/lib/python3.7/site-packages/` (macOS)
- `2.80/python/lib/site-packages/` (Windows)

#### Isolate from system blender

Also, very importantly an empty `config/` folder needs to be created in blender's `2.80/` directory, as to make elmyra's blender ignore the system blender and any addons that might be redundantly installed (and thus conflicting). See [Q/A on Blender Stackexchange](https://blender.stackexchange.com/questions/48392/make-blender-unaware-of-user-system-installed-add-ons)

### FFmpeg 4.2.1+ or recent snapshot build from git

This refers to the executables (`ffmpeg`, `ffplay`, etc. though only `ffmpeg` itself is needed) and not to the `libav*` C libraries.

## Asset dependencies

These are the blender files and image/font file assets Elmyra imports when it generates or updates visualizations. They are located inside `lib/elmyra/` and documented here for overview and development reference purposes.

- `environment.hdr`
- `illustrated.blend`
- `preview-widgets.blend`
- `realistic.blend`
- `section.blend`
