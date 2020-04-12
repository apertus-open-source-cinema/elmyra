'''
Opens, renders and exports a visualization

Optional arguments:
id -- the visualization to render
device -- the device to render on - 'CPU' or 'GPU' (default 'CPU')
target_time -- the minimum time to render, in seconds (default 60)
'''


import sys

from argparse import ArgumentParser
from os import chdir, path
from time import sleep


# Make this script's directory the current working directory (could be anything else)
# and add it to sys.path (this script runs from blender context)
elmyra_root = path.dirname(path.realpath(__file__))
chdir(elmyra_root)
sys.path.append(elmyra_root)

from lib import common, export, render, version
from lib.context import VISUALIZATIONS_DIR

def parse_custom_args():
    parser = ArgumentParser(prog='Elmyra Render Params')
    parser.add_argument("--id", required=True)
    parser.add_argument('--device', default='CPU')
    parser.add_argument('--target-time', type=int, default=60)

    custom_args = sys.argv[sys.argv.index('--') + 1:]

    return parser.parse_args(custom_args)


args = parse_custom_args()
common.ensure_addons()

if version.open_latest(path.join(VISUALIZATIONS_DIR, args.id)):
    render.render(args.target_time, args.device)
    export.export()
