"""
Generates and saves a new visualization

Custom arguments:
title -- the title
id -- the visualization identifier (only alphanumeric characters and dashes)
TODO
"""

import sys

from argparse import ArgumentParser
from os import path, remove

# Manually add elmyra's directory to sys.path because
# this script runs from blender context
sys.path.append(path.dirname(path.realpath(__file__)))

import common
import camera
import media
import meta
import modifier
import style
import update
import version


def parse_custom_args():
    parser = ArgumentParser(prog="Elmyra Generate Params")

    parser.add_argument("--id", required=True)
    parser.add_argument("--import-id", required=True)

    parser.add_argument("--media-type", required=True)
    parser.add_argument("--media-width", type=int, required=True)
    parser.add_argument("--media-height", type=int, required=True)
    parser.add_argument("--media-length", type=float, default=24)


    parser.add_argument("--camera-type", required=True)
    parser.add_argument("--style-type", required=True)

    parser.add_argument("--modifier-type", required=True)
    parser.add_argument("--modifier-section-axis", default="Z")
    parser.add_argument("--modifier-section-level", type=float, default=0.5)
    parser.add_argument("--modifier-section-level-from", type=float, default=0)
    parser.add_argument("--modifier-section-level-to", type=float, default=1)

    custom_args = sys.argv[sys.argv.index("--") + 1:]

    return parser.parse_args(custom_args)

args = parse_custom_args()

common.ensure_addons()
common.empty_scene()
common.setup_scene_defaults()

update.import_scene(args.import_id)

media.setup(args.media_type,
            args.media_width,
            args.media_height,
            args.media_length)

style.setup(args.style_type)
modifier.setup(args)
camera.setup(args)

version.save_new(args.id)
meta.write_media_info()
