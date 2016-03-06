import sys

from argparse import ArgumentParser
from os import path

# Manually add elmyra"s directory to sys.path because
# the params.py script runs from blender context

current_dir = path.dirname(path.realpath(__file__))
sys.path.append(current_dir)

# Own module imports

import common
import camera
import media
import meta
import modifier
import style
import update
import version


def options_from_args(args):
    parser = ArgumentParser(prog="Elmyra Generate Params")

    parser.add_argument("--title", required=True)
    parser.add_argument("--id", required=True)
    parser.add_argument("--description", default="Generated with Elmyra")
    parser.add_argument("--models", required=True)

    parser.add_argument("--media-type", required=True)
    parser.add_argument("--media-width", type=int, required=True)
    parser.add_argument("--media-height", type=int, required=True)
    parser.add_argument("--media-length", type=float, default=24)


    parser.add_argument("--camera-type", required=True)
    parser.add_argument("--style-type", required=True)

    parser.add_argument("--modifier-type", required=True)
    parser.add_argument("--modifier-section-axis", default="Z")
    parser.add_argument("--modifier-section-level", type=float, default=0.5)
    parser.add_argument("--modifier-section-animated")
    parser.add_argument("--modifier-section-animate-progress-from", type=float, default=0)
    parser.add_argument("--modifier-section-animate-progress-to", type=float, default=1)

    custom_args = args[sys.argv.index("--") + 1:]

    return parser.parse_args(custom_args)

options = options_from_args(sys.argv)

common.setup_default_scene()
media.setup(options)
update.generate_objects(options.models.splitlines())
style.setup(options)
modifier.setup(options)
camera.setup(options)
version.save_new(options.id)
meta.write_media_info()
