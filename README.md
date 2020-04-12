# Elmyra

An experimental blender-based rapid iterative visualization system.

[![Conference presentation video thumbnail](http://files.apertus.org/elmyra/screencast-youtube-screenshot.png?)](https://www.youtube.com/watch?v=l8x8Kz1T1uc "Elmyra Screencast")

## Download for your OS

- [Linux (x64)](http://files.apertus.org/elmyra/elmyra-1.0-linux-x64.zip)
- [macOS (x64)](http://files.apertus.org/elmyra/elmyra-1.0-macos-x64.zip)
- [Windows (x64)](http://files.apertus.org/elmyra/elmyra-1.0-windows-x64.zip)

After extracting the `.zip` package, `cd` into the folder and run the executable with `./elmyra`. By default the server listens on all addresses and port `8080` and thus should be reachable from your browser at `localhost:8080`. Run `./elmyra --help` to see all configuration options. Note that you *don't* need to install blender or anything at all, everything comes bundled with the release package and should work out of the box. Blender data, image and video files, temporary runtime data, etc. are by default stored in folders next to the executable - this can be configured as well.

## What is Elmyra?

- **Visualization Wizard** - Create animated or static visualizations from primitive 3D input files in the browser
- **Automated Rendering** - Get a draft immediately and higher-quality versions delivered continuously over time
- **Continuous Delivery** - Share/embed links to images/videos that always deliver up-to-date material
- **Blender Inside** - At its core Elmyra uses [Blender](https://www.blender.org/), all visualizations can be downloaded as blender files
- **Free & Open Source** - Developed as a part of the [AXIOM Gamma](http://apertus.org/axiom-gamma) project

For a quick introduction watch the [Elmyra Screencast](https://www.youtube.com/watch?v=l8x8Kz1T1uc), also linked above. (8min)  
For more project history and background check out the [Blender Conference 2015 Presentation](https://youtu.be/ht1hPNjQxcY?t=24s) . (23min)

## Express permission to innovate

Elmyra is not a finalized product idea for consumation only, but a solid, approachable codebase modeling a different paradigm of how industrial/architectural/etc. visualization can be reimagined. You are expressly invited to build on our research and development, reinvent Elmyra's vision, hack it, fork it, extend it, make it your own and share your developments with the community. We're excited to hear what you come up with and glad to help out with know-how on the codebase where we can, feel absolutely free to open an issue and ask for help.

## Building from source

### Get the source code

    git clone https://github.com/apertus-open-source-cinema/elmyra.git

### Download the bundled dependencies and assets

Download and unzip the [bundled dependencies and assets](http://files.apertus.org/elmyra/elmyra-lib.zip) and put the `lib` folder inside Elmyra's root directory.

### Install language dependencies

Install [rustup](https://rustup.rs/) and [node.js](https://nodejs.org/).

Inside elmyra's root directory run the following:

```
rustup override set nightly
npm install
```

### Build and run it

By running `npm run build` you can now create a build for your platform. The
finished build will be placed under `build/elmyra-[version]-[platform]-[arch]/` and to
start it you simply execute the `elmyra` binary. By default the server listens
on all network interfaces and the automatically assigned port is shown in the
terminal output right on startup.

Use `./elmyra --help` to read up on available command line options like server
address and port, as well as more advanced/exotic configuration options.

## Versioning

Elmyra uses compatible versioning (ComVer)

[![ComVer](https://img.shields.io/badge/ComVer-compliant-brightgreen.svg)](https://github.com/staltz/comver)

## Acknowledgements

Elmyra could not have been brought to life without the heart that beats at its core - [Blender](http://blender.org) - and its incredibly helpful and inspiring community; It would not even closely be what it is without [FFmpeg](http://ffmpeg.org) and its hardworking volunteer force; and in the first place, it could not have been conceived without the individuals and organizations that created this open, enabling environment for it to grow in - the AXIOM project. Thanks so much everyone!
