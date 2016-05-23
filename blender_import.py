"""
Imports from a URL and saves a new temp file for import

Custom arguments:
scene -- the name for the import scene
url -- the url to the import file
"""

import sys

from argparse import ArgumentParser
from os import path

# Manually add elmyra's directory to sys.path because
# this script runs from blender context
sys.path.append(path.dirname(path.realpath(__file__)))

import common
import update


def parse_custom_args():
    parser = ArgumentParser(prog="Elmyra Import Params")

    parser.add_argument("--scene", required=True)
    parser.add_argument("--url", required=True)

    custom_args = sys.argv[sys.argv.index("--") + 1:]

    return parser.parse_args(custom_args)

args = parse_custom_args()

common.empty_scene()
update.import_model(args.url, args.scene)
