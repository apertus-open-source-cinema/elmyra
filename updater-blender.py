import os
import sys

from argparse import ArgumentParser
from time import time

# Manually add elmyra's directory to sys.path because
# the params.py script runs from blender context

current_dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(current_dir)

# Own module imports

import meta
import update
import version


def options_from_args(args):
    parser = ArgumentParser(prog="Elmyra Update Params")
    parser.add_argument("--id", required=True)
    parser.add_argument("--min-interval", type=int, default=None)
    parser.add_argument("--blend", default=None)

    custom_args = args[sys.argv.index('--') + 1:]

    return parser.parse_args(custom_args)


options = options_from_args(sys.argv)


if options.blend:
    version.open_new(options.blend)
    version.save_new(options.id)
    meta.write_media_info()
else:
    run_updates = True

    if options.min_interval:
        meta = meta.get()
        if "lastUpdate" in meta:
            run_updates = time() - meta["lastUpdate"] < options.min_interval

    if run_updates:
        version.open_latest(options.id)

        # TODO: Find problem: Why does it update although hash stayed the same?
        #       (Happened on update form external sources manually)
        #       (Note 06/03/2016 - not sure if still applies)

        if update.update_models():
            version.save_new(options.id)
            meta.write_media_info()
    else:
        meta.write({"lastUpdate": time()})
