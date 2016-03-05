# Elmyra

**A blender-based rapid iterative visualization system.**

[![Interface thumbnail 1](http://files.apertus.org/elmyra/interface-1-thumbnail.png)](http://files.apertus.org/elmyra/interface-1.png) &nbsp;
[![Interface thumbnail 2](http://files.apertus.org/elmyra/interface-2-thumbnail.png)](http://files.apertus.org/elmyra/interface-2.png) &nbsp;

[![Interface thumbnail 4](http://files.apertus.org/elmyra/interface-4-thumbnail.png)](http://files.apertus.org/elmyra/interface-4.png) &nbsp;
[![Interface thumbnail 3](http://files.apertus.org/elmyra/interface-3-thumbnail.png)](http://files.apertus.org/elmyra/interface-3.png) &nbsp;

## What is Elmyra?

- **Visualization Wizard** - Create rendered or interactive presentations of your CAD work in the browser
- **Automated Rendering** - Get drafts immediately, and high-quality versions later, automatically
- **Continuous Deployment** - Embed visualizations via URLs that always deliver up-to-date material
- **Blender Based** - If [Blender](https://www.blender.org/) can render it, Elmyra can as well, because that's what runs inside
- **Free & Open Source** - Developed as a part of the [AXIOM Gamma](http://apertus.org/axiom-gamma) project

Want to know more? Check out the [Blender Conference Presentation](https://youtu.be/ht1hPNjQxcY?t=24s)  (23min)

## Setting up Elmyra

**Heads up: This is a preview (alpha) release** - but don't be afraid! Give it a try and post a report if you encounter problems, we're eager to fix them and get Elmyra production ready as soon as possible!

### One single requirement

[Python 3.4+](https://www.python.org/) needs to be installed on your system (Run `python3 --version` in a console to see if and which version is installed, if it's none or the wrong one please refer to [python.org](https://www.python.org/) for installation instructions).

(Note: Although Elmyra is heavily based on Blender, you don't need to have Blender installed - it comes bundled with Elmyra already!)

### Setup

- Download the release package: &nbsp;[`Windows`](http://files.apertus.org/elmyra/elmyra-preview-windows.zip)
 &nbsp;[`OS X`](http://files.apertus.org/elmyra/elmyra-preview-osx.zip)
 &nbsp;[`Linux`](http://files.apertus.org/elmyra/elmyra-preview-linux.zip)

- Unzip it anywhere, open a terminal, navigate to Elmyra's root directory and enter:

          pip3 install -r requirements.txt

## Starting Elmrya

### The Server

The server hosts the browser interface through which you work with Elmyra -
it serves all media files that Elmyra produces, it creates or updates  visualizations when you order it to and also lets you download them.

Open a terminal, navigate to elmyra's root directory, then enter:

     python3 server.py

In your browser, you can now navigate to `http://localhost:5000/`

### The Renderer

The renderer does just that, for as long as it runs it takes any visualization
you created in Elmyra and renders it. If the visualization was already rendered,
it does another pass to improve the quality of the render. It never stops (unless you quit it) and it cycles through all your visualizations over and over, spending only a certain amount of time on each one.

Open another terminal at elmyra's root directory, then enter:

    python3 renderer.py

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

### Runtime Dependencies

To run Elmyra, [Python 3.4+](https://www.python.org/) needs to be installed on your system (Run `python3 --version` in a console to see if and which version is installed, if it's none or the wrong one please refer to [python.org](https://www.python.org/) for installation instructions).

To install required additional python packages, enter inside elmyra's root directory:

    pip3 install -r requirements.txt
