# Elmyra

A blender-based rapid iterative visualization system

[![Conference presentation video thumbnail](http://fdpl.foundation/elmyra/youtube-screenshot.png)](http://www.youtube.com/watch?v=ht1hPNjQxcY "Video Title")

Watch the [Blender Conference presentation on Elmyra](https://www.youtube.com/watch?v=ht1hPNjQxcY) for an introduction!

## Setting up Elmyra

*HEADS UP: This is an initial, rather unappealing setup procedure, we'll work on making the whole setup easier as we go along!*

### Elmyra itself (1/3)

[Download](https://github.com/apertus-open-source-cinema/elmyra/archive/master.zip) and unzip OR clone this repository to your computer:

    git clone https://github.com/apertus-open-source-cinema/elmyra.git

### Binary Assets (2/3)

Download and unzip the [binary assets archive](http://fdpl.foundation/elmyra/elmyra-binary-assets.zip) and put the contained `library` folder inside Elmyra's root directory (alongside `static` and `templates` and all the `.py` files).

*In case you're wondering - these binary assets are provided seperately because they're rather big compared to the actual sourcecode that makes up Elmyra, and thus they would very soon clog up the code repository if they would be included in there as well.*

### Runtime Dependencies (3/3)

Elmyra relies on some depencies we have to meet, this is a comprehensive list of them, please go through them one by one and make sure they are all met to finish the setup procedure:

#### [Python 3](https://www.python.org/)

- `python3` executable available in a terminal ([Help](#checking-and-installing-python-3))
- Packages required in **system python environment** ([Help](#installing-packages-into-the-system-python-environment))
  - `flask`
  - `natsort`
  - `python-slugify`

#### [Blender](http://blender.org/)
- `blender` executable available in a terminal ([Help](#checking-and-installing-blender))
- Packages required in **blender python environment** ([Help](#installing-packages-into-the-blender-python-environment))
  - `certifi`
  - `natsort`
  - `pillow`
  - `requests`

#### [FFmpeg](http://ffmpeg.org/)
- `ffmpeg` executable available in a terminal ([Help](#checking-and-installing-ffmpeg))

## Starting up Elmrya

### The Server (1/3)

The server hosts the browser interface through which you work with Elmyra -
it serves all media files that Elmyra produces, it creates or updates  visualizations when you order it to, and also lets you download them.

To start the server, open a terminal, navigate to elmyra's root directory, then enter:

     python3 server.py

### The Renderer (2/3)

The renderer does just that, for as long as it runs it takes any visualization
you created in Elmyra and renders it. If the visualization was already rendered,
it does another pass to improve the quality of the render. It never stops (unless you quit it) and it cycles through all your visualizations over and over, spending only a certain amount of time on each one.

To start the renderer, open another terminal at elmyra's root directory, then enter:

    python3 renderer.py

### The Interface (3/3)

Now open up your favourite browser, go to this address and have fun:

    http://localhost:5000/

#### Requirements

- IE 10+
- Recent Firefox
- Recent Chrome
- Safari 6+

## Addendum: Setup Guides

The following paragraphs contain short instructions or links on how to accomplish specific steps during the setup of Elmyra, no need to read through them unless you are struggling to install some of Elmyra's dependencies.

### Checking and installing Python 3

To test whether `python3` is installed simply open up a terminal and type:

    python3 --version

If this doesn't output the installed version, you need to install it.
Please google for something like "install python3 [insert your operating system here]".

### Installing packages into the system python environment

For instance, to install flask, open a terminal and type:

    pip3 install flask

### Checking and installing Blender

To test whether `blender` is installed and available in a terminal simply open up one and type:

    blender --version

If this doesn't output the installed version, you need to install it.
You can get Blender from [blender.org](http://blender.org).

If Blender is installed but not available from the terminal (Linux/Mac):

    sudo ln -s /full/path/to/blender /usr/bin/blender

### Installing packages into the blender python environment

Take a look at the respective section in the [Blender bpy API documentation](http://www.blender.org/api/blender_python_api_2_76b_release/info_tips_and_tricks.html#bundled-python-extensions)

### Checking and installing ffmpeg

To test whether `ffmpeg` is installed, open up a terminal and type:

    ffmpeg -version

If this doesn't output the installed version, you need to install it.
Ideally try to install it through your system package manager, otherwise you can also get it [here](http://ffmpeg.org/download.html).

If ffmpeg is installed but not available from the terminal (Linux/Mac):

    sudo ln -s /full/path/to/ffmpeg /usr/bin/ffmpeg
