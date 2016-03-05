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

## Getting started

**Heads up:** This is a preview (alpha) release - but the more people test and report problems, the sooner it'll be production ready! :)  

### Requirements
- You **need** to have [Python 3.4+](https://www.python.org/) installed - you can check this with `python3 --version` (on some platforms without the `3`).

- You **don't need** to have Blender installed - it comes bundled with Elmyra.

### Steps

- Download the release package: &nbsp;[`Windows`](http://files.apertus.org/elmyra/elmyra-preview-windows.zip)
 &nbsp;[`OS X`](http://files.apertus.org/elmyra/elmyra-preview-osx.zip)
 &nbsp;[`Linux`](http://files.apertus.org/elmyra/elmyra-preview-linux.zip)

- Unzip it anywhere, open a terminal, navigate to Elmyra's root directory and enter:

          pip3 install -r requirements.txt

- Start the server:

       python3 server.py

- Open another terminal and start the renderer (can be started and stopped anytime actually):

      python3 renderer.py

- Done! Open your browser and go to `http://localhost:5000/`

## Setting up Elmyra for Development

### Source code

    git clone https://github.com/apertus-open-source-cinema/elmyra.git

### Bundled dependencies and assets

Download and unzip the [bundled dependencies and assets](http://files.apertus.org/elmyra/elmyra-lib.zip) and put the `lib` folder inside Elmyra's root directory.

### Development Dependencies

In order to compile the css and javascript for the Elmyra frontend, you need to install [node.js](https://nodejs.org/) and [gulp](http://gulpjs.com/). For node.js please refer to the instructions on their website, for gulp and the remaining dependencies run this anywhere in a terminal:

    sudo npm install -g gulp

And inside elmyra's root directory:

    npm install

Now you can compile the assets either manually by running `gulp`, or let gulp watch for changes and recompile automatically by running `gulp watch`. Additionally, there are gulp tasks to create releases - `gulp release-[windows/osx/linux]` - which collect all relevant files and put them into an archive named after the platform (e.g. `windows.zip`) in the `release/` directory.

Elmyra uses a platform-dependent configuration module (`configuration.py`) in its root directory to determine the paths to the bundled dependencies, before starting the server the correct configuration module has to be copied over from the respective `lib/[windows/osx/linux]` folders by running one of the `gulp configure-[windows/osx/linux]` tasks.
