# Elmyra

A blender-based rapid iterative visualization system.

[![Conference presentation video thumbnail](http://files.apertus.org/elmyra/screencast-youtube-screenshot.png?)](https://www.youtube.com/watch?v=l8x8Kz1T1uc "Elmyra Screencast")

## Download for your OS

Includes a ready to run executable, no setup whatsoever needed!

- [Windows 7+ (x64)](http://files.apertus.org/elmyra/elmyra-05d44d5-windows.zip)
- [macOS 10.9+ (x64)](http://files.apertus.org/elmyra/elmyra-05d44d5-macos.zip)
- [Linux - Ubuntu 12.04+ / Fedora 21+ / Debian 8+ (x64)](http://files.apertus.org/elmyra/elmyra-05d44d5-linux.zip)

## What is Elmyra?

- **Visualization Wizard** - Create rendered or interactive presentations of your CAD work in the browser
- **Automated Rendering** - Get drafts immediately, and high-quality versions later, automatically
- **Continuous Deployment** - Embed visualizations via URLs that always deliver up-to-date material
- **Blender Inside** - If [Blender](https://www.blender.org/) can render it, Elmyra can as well, because that's at its core
- **Free & Open Source** - Developed as a part of the [AXIOM Gamma](http://apertus.org/axiom-gamma) project

For a quick introduction watch the [Elmyra Screencast](https://www.youtube.com/watch?v=l8x8Kz1T1uc), also linked above. (8min)  
For more project history and background check out the [Blender Conference 2015 Presentation](https://youtu.be/ht1hPNjQxcY?t=24s) . (23min)

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

### Build it

By running `npm run package` you can now create a build for your platform. The
finished build will be placed under `build/elmyra-[platform]-[arch]/` and to
start it you simply execute the `elmyra` binary. By default the server listens
on all network interfaces and the automatically assigned port is shown in the
terminal output right on startup.

## Acknowledgements

Elmyra could not have been brought to life without the heart that beats at its core - [Blender](http://blender.org) - and its incredibly helpful and inspiring community; It would not even closely be what it is without [FFmpeg](http://ffmpeg.org) and its hardworking volunteer force; and in the first place, it could not have been conceived without the individuals and organizations that created this open, enabling environment for it to grow in - the AXIOM project. Thanks so much everyone!
