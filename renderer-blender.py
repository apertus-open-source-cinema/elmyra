import sys

from argparse import ArgumentParser
from os import path

# Manually add elmyra's directory to sys.path because
# the params.py script runs from blender context

current_dir = path.dirname(path.realpath(__file__))
sys.path.append(current_dir)

# Own module imports

import export
import render
import version

DEFAULT_RENDER_TIME = 60 # seconds

def options_from_args(args):
    parser = ArgumentParser(prog="Elmyra Render Params")
    parser.add_argument("--id", required=True)
    parser.add_argument("--device", default="CPU")

    custom_args = args[sys.argv.index('--') + 1:]

    return parser.parse_args(custom_args)


options = options_from_args(sys.argv)

version.open_latest(options.id)
render.render(DEFAULT_RENDER_TIME, options.device)
export.export(options)
