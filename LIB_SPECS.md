# Specifications for bundled dependencies in `lib/`

**The paths to the dependencies' executables need to be updated in the launchers and library modules located under `src/[platform]` for every change!**

The officially maintained library bundle is available at http://files.apertus.org/elmyra/elmyra-lib.zip

## Blender 2.78a

### Additional Python packages

The blender python environment needs additional packages installed:

- `certifi`
- `natsort`

These packages go into:

- `2.78/python/lib/python3.5/site-packages/` (Linux)
- `Contents/Resources/2.78/python/lib/python3.5/site-packages/` (macOS)
- `2.78/python/lib/site-packages/` (Windows)

### Additional addons

These **addons** need to be installed additionally:
- **Blend4Web (16.10)**

  The *add-on* version, **not** the *sdk-free* version

  Available from https://www.blend4web.com/

### Isolate from system blender

Also, very importantly an empty `config/` folder needs to be created in blender's `2.78/` directory, as to make elmyra's blender ignore the system blender and any addons that might be redundantly installed (and thus conflicting). See [Q/A on Blender Stackexchange](http://blender.stackexchange.com/questions/48392/make-blender-unaware-of-user-system-installed-add-ons)

## FFmpeg 4.2.1+ or recent snapshot build from git

This refers to the executables (`ffmpeg`, `ffplay`, etc. though only `ffmpeg` itself is needed) and not to the `libav*` C libraries.
