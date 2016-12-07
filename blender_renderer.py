"""
Opens, renders and exports all visualizations in a constant cycle

Optional arguments:
device -- the device to render on - "CPU" or "GPU" (default "CPU")
target_time -- the minimum time to render, in seconds (default 60)
"""


import json
import sys

from argparse import ArgumentParser
from glob import glob
from natsort import natsorted
from os import chdir, path
from time import sleep

elmyra_root = path.dirname(path.realpath(__file__))

# Make elmyra's root dir the current working directory (could be anything else)
chdir(elmyra_root)

# Add elmyra's root dir to sys.path (this script runs from blender context)
sys.path.append(elmyra_root)

import common
import export
import render
import version


def parse_custom_args():
    parser = ArgumentParser(prog="Elmyra Renderer Params")
    parser.add_argument("--device", default="CPU")
    parser.add_argument("--target_time", type=int, default=60)

    custom_args = sys.argv[sys.argv.index('--') + 1:]

    return parser.parse_args(custom_args)


def render_visualization(id):
    version.open_latest(id)
    render.render(args.target_time, args.device)
    export.export()


def render_loop():
    while True:
        for viz in glob("visualizations/*"):
            for viz_priority in glob("visualizations/*"):
                latest_version = natsorted(glob(path.join(viz_priority, "*")))[-1]
                meta_filepath = path.join(latest_version, "meta.json")

                if path.exists(meta_filepath):
                    with open(meta_filepath) as file:
                        meta = json.loads(file.read())

                        if not "lastRender" in meta:
                            id = path.basename(viz_priority)
                            render_visualization(id)

            id = path.basename(viz)
            render_visualization(id)

        sleep(1)


args = parse_custom_args()
common.ensure_addons()
render_loop()
