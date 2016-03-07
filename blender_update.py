"""
Updates the scene from a blendfile or by trying to update from the original URLs

Custom arguments:
id -- the visualization identifier (required)
blend -- a path to a blendfile to replace the current scene with (optional)
min_interval -- a minimum time to keep between updates, in seconds (optional)
"""


import sys

from argparse import ArgumentParser
from os import path
from time import time

# Manually add elmyra's directory to sys.path because
# this script runs from blender context
sys.path.append(path.dirname(path.realpath(__file__)))

import common
import meta
import update
import version


def parse_custom_args():
    parser = ArgumentParser(prog="Elmyra Update Params")
    parser.add_argument("--id", required=True)
    parser.add_argument("--blend", default=None)
    parser.add_argument("--min-interval", type=int, default=None)

    custom_args = sys.argv[sys.argv.index('--') + 1:]

    return parser.parse_args(custom_args)


args = parse_custom_args()


common.ensure_addons()

if args.blend:
    version.open_new(args.blend)
    version.save_new(args.id)
    meta.write_media_info()
else:
    run_updates = True

    if args.min_interval:
        meta = meta.get()
        if "lastUpdate" in meta:
            run_updates = time() - meta["lastUpdate"] < args.min_interval

    if run_updates:
        version.open_latest(args.id)

        # TODO: Find problem: Why does it update although hash stayed the same?
        #       (Happened on update form external sources manually)
        #       (Note 06/03/2016 - not sure if still applies)

        if update.update_models():
            version.save_new(args.id)
            meta.write_media_info()
    else:
        meta.write({"lastUpdate": time()})
