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

## Developer Documentation

### Source code

    git clone https://github.com/apertus-open-source-cinema/elmyra.git

### Bundled dependencies and assets

Download and unzip the [bundled dependencies and assets](http://files.apertus.org/elmyra/elmyra-lib.zip) and put the `lib` folder inside Elmyra's root directory.

### Development Dependencies

In order to compile css and javascript for the frontend and automatically configure the correct platform-dependent library paths for the various scripts, you need to install [node.js](https://nodejs.org/) and [gulp 4](http://gulpjs.com/). For node.js please refer to the instructions on their website, for gulp and the remaining dependencies run this anywhere in a terminal:

    sudo npm install -g gulp-cli

And inside elmyra's root directory:

    npm install

Now you can compile and configure your development installation manually by running `gulp build`, or let gulp build and then watch for changes and recompile automatically by just running `gulp`. For development you can start elmyra by running `npm start`.

For releasing, there is a gulp task to create releases for all platforms - `gulp release` - which sequentially builds and collects all relevant files and puts them into archives tagged with platform and commit hash (e.g. `elmyra-ab349c-windows.zip`) in the `release` directory.

## Acknowledgements

Elmyra could not have been brought to life without the heart that beats at its core - [Blender](http://blender.org) - and its incredibly helpful and inspiring community; It would not even closely be what it is without [FFmpeg](http://ffmpeg.org) and its hardworking volunteer force; and in the first place, it could not have been conceived without the individuals and organizations that created this open, enabling environment for it to grow in - the AXIOM project. Thanks so much everyone!
