"""
Opens, renders and exports a given visualization

Custom arguments:
id -- the visualization identifier (required)
device -- the device to render on - "CPU" or "GPU" (optional, default "CPU")
target_time -- the minimum time to render, in seconds (optional, default 60)
"""


import sys

from argparse import ArgumentParser
from os import path

# Manually add elmyra's directory to sys.path because
# this script runs from blender context
sys.path.append(path.dirname(path.realpath(__file__)))

import common
import export
import render
import version


def parse_custom_args():
    parser = ArgumentParser(prog="Elmyra Render Params")
    parser.add_argument("--id", required=True)
    parser.add_argument("--device", default="CPU")
    parser.add_argument("--target_time", default=60)

    custom_args = sys.argv[sys.argv.index('--') + 1:]

    return parser.parse_args(custom_args)


args = parse_custom_args()

common.ensure_addons()
version.open_latest(args.id)
render.render(args.target_time, args.device)
export.export()
