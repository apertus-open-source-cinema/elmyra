# Specifications for bundled dependencies in `lib/`

**The paths to the dependencies' executables need to be updated in the launchers located under `src/[platform]` for every change!**

The officially maintained library bundle is available at http://files.apertus.org/elmyra/elmyra-lib.zip

## Blender 2.77a

The default blender python environment needs additional packages installed:

- `certifi`
- `flask` (including dependencies: werkzeug, jinja2, itsdangerous, markupsafe - check yourself!)
- `natsort`

These **addons** need to be installed additionally:
- **Blend4Web (16.02)**

  The *add-on* version, **not** the *sdk-free* version

  Available from https://www.blend4web.com/

## FFMpeg 3.1+ or recent snapshot build from git
