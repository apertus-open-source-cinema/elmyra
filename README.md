# Elmyra

An experimental blender-based rapid iterative visualization system.

[![Conference presentation video thumbnail](http://files.apertus.org/elmyra/screencast-youtube-screenshot.png?)](https://www.youtube.com/watch?v=l8x8Kz1T1uc "Elmyra Screencast")

## Download for your OS

Includes a ready to run executable, no setup whatsoever needed!

- [Windows 7+ (x64)](http://files.apertus.org/elmyra/elmyra-05d44d5-windows.zip)
- [macOS 10.9+ (x64)](http://files.apertus.org/elmyra/elmyra-05d44d5-macos.zip)
- [Linux - Ubuntu 12.04+ / Fedora 21+ / Debian 8+ (x64)](http://files.apertus.org/elmyra/elmyra-05d44d5-linux.zip)

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
rustup install nightly
rustup override set nightly
npm install
```

### Build and run it

By running `npm run build` you can now create a build for your platform. The
finished build will be placed under `build/elmyra-[platform]-[arch]/` and to
start it you simply execute the `elmyra` binary. By default the server listens
on all network interfaces and the automatically assigned port is shown in the
terminal output right on startup.

Use `./elmyra --help` to read up on available command line options like server
address and port, as well as more advanced/exotic configuration options.

## Acknowledgements

Elmyra could not have been brought to life without the heart that beats at its core - [Blender](http://blender.org) - and its incredibly helpful and inspiring community; It would not even closely be what it is without [FFmpeg](http://ffmpeg.org) and its hardworking volunteer force; and in the first place, it could not have been conceived without the individuals and organizations that created this open, enabling environment for it to grow in - the AXIOM project. Thanks so much everyone!
