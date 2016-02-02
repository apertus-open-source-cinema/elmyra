# Elmyra

A blender-based rapid iterative visualization system

[![Conference presentation video thumbnail](http://files.apertus.org/elmyra/youtube-screenshot.png)](http://www.youtube.com/watch?v=ht1hPNjQxcY "Video Title")

Watch the [Blender Conference presentation on Elmyra](https://www.youtube.com/watch?v=ht1hPNjQxcY) for an introduction!

## Setting up Elmyra (User Guide)

**Important:** To run Elmyra, [Python 3.4+](https://www.python.org/) needs to be installed on your system (Run `python3 --version` in a console to see if and which version is installed, if it's none or the wrong one please refer to [python.org](https://www.python.org/) for installation instructions).

Download and unzip the release package for your OS:

- Windows (almost done - coming in a few days)
- [OS X](http://files.apertus.org/elmyra/osx.zip)
- [Linux](http://files.apertus.org/elmyra/linux.zip)

Open a terminal, navigate to elmyra's root directory, then enter:

    pip3 install -r requirements.txt

## Starting Elmrya

### The Server

The server hosts the browser interface through which you work with Elmyra -
it serves all media files that Elmyra produces, it creates or updates  visualizations when you order it to and also lets you download them.

Open a terminal, navigate to elmyra's root directory, then enter:

     python3 server.py

In your browser, you can now navigate to:

    http://localhost:5000/

### The Renderer

The renderer does just that, for as long as it runs it takes any visualization
you created in Elmyra and renders it. If the visualization was already rendered,
it does another pass to improve the quality of the render. It never stops (unless you quit it) and it cycles through all your visualizations over and over, spending only a certain amount of time on each one.

Open another terminal at elmyra's root directory, then enter:

    python3 renderer.py

## Setting up Elmyra (Developer Guide)

### Source code

    git clone https://github.com/apertus-open-source-cinema/elmyra.git

### Bundled dependencies and assets

Download and unzip the [bundled dependencies and assets](http://files.apertus.org/elmyra/lib.zip) and put the `lib` folder inside Elmyra's root directory.

### Development Dependencies

In order to compile the css and javascript for the Elmyra frontend, you need to install [node.js](https://nodejs.org/) and [gulp](http://gulpjs.com/). For node.js please refer to the instructions on their website, for gulp and the remaining dependencies run this anywhere in a terminal:

    sudo npm install -g gulp

And inside elmyra's root directory:

    npm install

Now you can compile the assets either manually by running `gulp`, or let gulp watch for changes and recompile automatically by running `gulp watch`. Additionally, there are gulp tasks to create releases - `gulp release-[windows/osx/linux]` - which collect all relevant files and put them into an archive named after the platform (e.g. `windows.zip`) in the `release/` directory.

### Runtime Dependencies

To run Elmyra, [Python 3.4+](https://www.python.org/) needs to be installed on your system (Run `python3 --version` in a console to see if and which version is installed, if it's none or the wrong one please refer to [python.org](https://www.python.org/) for installation instructions).

To install required additional python packages, enter inside elmyra's root directory:

    pip3 install -r requirements.txt
