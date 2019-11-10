"""
Generates and saves a new visualization

Custom arguments:
title -- the title
id -- the visualization identifier (only alphanumeric characters and dashes)
TODO
"""

import sys

from argparse import ArgumentParser
from os import chdir, path

elmyra_root = path.dirname(path.realpath(__file__))

# Make this script's directory the current working directory (could be anything else)
# and add it to sys.path (this script runs from blender context)
elmyra_root = path.dirname(path.realpath(__file__))
chdir(elmyra_root)
sys.path.append(elmyra_root)

from lib import common, camera, media, meta, modifier, style, update, version


def parse_custom_args():
    parser = ArgumentParser(prog="Elmyra Generate Params")

    parser.add_argument('--data-dir', required=True)

    parser.add_argument("--id", required=True)
    parser.add_argument("--import-id", required=True)

    parser.add_argument("--media-animated", required=True)
    parser.add_argument("--media-width", type=int, required=True)
    parser.add_argument("--media-height", type=int, required=True)
    parser.add_argument("--media-length", type=float, default=24)

    parser.add_argument("--orient-flip-horizontally", required=True)
    parser.add_argument("--orient-flip-vertically", required=True)
    parser.add_argument("--orient-rotate-x", type=float, required=True)
    parser.add_argument("--orient-rotate-y", type=float, required=True)
    parser.add_argument("--orient-rotate-z", type=float, required=True)

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

import_dir = path.join(args.data_dir, "imports", args.import_id)
visualization_dir = path.join(args.data_dir, "visualizations", args.id)

common.ensure_addons()
common.empty_scene()
common.setup_scene_defaults()

update.import_scene(import_dir,
                    args.orient_flip_horizontally,
                    args.orient_flip_vertically,
                    args.orient_rotate_x,
                    args.orient_rotate_y,
                    args.orient_rotate_z)

media.setup(args.media_animated,
            args.media_width,
            args.media_height,
            args.media_length)

style.setup(args.style_type)
modifier.setup(args)
camera.setup(args)

version.save_new(visualization_dir)
meta.write_media_info()
