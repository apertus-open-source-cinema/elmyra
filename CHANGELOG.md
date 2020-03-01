# Changelog

This project uses compatible versioning (https://gitlab.com/staltz/comver).

As Elmyra internally creates blender files (and lets you export and import them back), each release is tied to a certain Blender version to define a frame of compatibility for usage. For each Elmyra release that upgrades to a new blender version the compatible blender release will be listed in parentheses.

## 1.0 (Blender 2.82)

- Elmyra has been upgraded to work with the new Blender 2.80 series, starting at 2.82 for this release
- The server implementation has been completely rewritten in Rust
- A multitude of command line configuration options have been added
- The frontend build process has been migrated to a more modular, bundling based approach
- All frontend/backend dependencies have been updated to their latest versions
- About half of the frontend component implementations have been refactored and modernized
- The blend4web integration was removed (unclear blender 2.80 support, never made it past experimental stage)

## Pre 1.0 (Blender 2.79)

The initial releases of Elmyra were unversioned, they may be of interest to you because they had server implementations in different languages (python/flask in the beginning, javascript/express after that). Other than for historical reference and consulting prior implementation strategies their history should by now have little relevane though.
