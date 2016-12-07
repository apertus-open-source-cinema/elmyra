# Elmyra

A blender-based rapid iterative visualization system.

[![Interface thumbnail 1](http://files.apertus.org/elmyra/interface-1-thumbnail.png)](http://files.apertus.org/elmyra/interface-1.png) &nbsp;
[![Interface thumbnail 2](http://files.apertus.org/elmyra/interface-2-thumbnail.png)](http://files.apertus.org/elmyra/interface-2.png) &nbsp;

[![Interface thumbnail 4](http://files.apertus.org/elmyra/interface-4-thumbnail.png)](http://files.apertus.org/elmyra/interface-4.png) &nbsp;
[![Interface thumbnail 3](http://files.apertus.org/elmyra/interface-3-thumbnail.png)](http://files.apertus.org/elmyra/interface-3.png) &nbsp;

## What is Elmyra?


- **Visualization Wizard** - Create rendered or interactive presentations of your CAD work in the browser
- **Automated Rendering** - Get drafts immediately, and high-quality versions later, automatically
- **Continuous Deployment** - Embed visualizations via URLs that always deliver up-to-date material
- **Blender Inside** - If [Blender](https://www.blender.org/) can render it, Elmyra can as well, because that's at its core
- **Free & Open Source** - Developed as a part of the [AXIOM Gamma](http://apertus.org/axiom-gamma) project

Want to know more? Check out the [Blender Conference Presentation](https://youtu.be/ht1hPNjQxcY?t=24s)  (23min)

## Download for your OS

- [Windows 7+ (x64)](http://files.apertus.org/elmyra/elmyra-05d44d5-windows.zip)
- [macOS 10.9+ (x64)](http://files.apertus.org/elmyra/elmyra-05d44d5-macos.zip)
- [Linux - Ubuntu 12.04+ / Fedora 21+ / Debian 8+ (x64)](http://files.apertus.org/elmyra/elmyra-05d44d5-linux.zip)

## Setting up Elmyra for Development

### Source code

    git clone https://github.com/apertus-open-source-cinema/elmyra.git

### Bundled dependencies and assets

Download and unzip the [bundled dependencies and assets](http://files.apertus.org/elmyra/elmyra-lib.zip) and put the `lib` folder inside Elmyra's root directory.

### Development Dependencies

In order to compile css and javascript for the frontend and automatically configure the correct platform-dependent library paths for the various scripts, you need to install [node.js](https://nodejs.org/) and [gulp 4](http://gulpjs.com/). For node.js please refer to the instructions on their website, for gulp and the remaining dependencies run this anywhere in a terminal:

    sudo npm install -g gulpjs/gulp-cli

And inside elmyra's root directory:

    npm install

Now you can compile and configure your development installation manually by running `gulp build`, or let gulp build and then watch for changes and recompile automatically by just running `gulp`. For development you can start elmyra by running `npm start`.

For releasing, there is a gulp task to create releases for all platforms - `gulp release` - which sequentially builds and collects all relevant files and puts them into archives tagged with platform and commit hash (e.g. `elmyra-ab349c-windows.zip`) in the `release` directory.

## Acknowledgements

Elmyra could not have been brought to life without the heart that beats at its core - [Blender](http://blender.org) - and its incredibly helpful and inspiring community; It would not even closely be what it is without [FFmpeg](http://ffmpeg.org) and its hardworking volunteer force; and in the first place, it could not have been conceived without the individuals and organizations that created this open, enabling environment for it to grow in - the AXIOM project. Thanks so much everyone!
