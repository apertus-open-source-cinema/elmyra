"""Renders and exports all visualizations, over and over"""

from glob import glob
import json
from natsort import natsorted
from os import path
from subprocess import call


RENDER_SCRIPT = path.join(path.dirname(__file__), 'blender_render.py')
LOOP = True


def render(id):
    call([
        "blender",
        "--background",
        "--python", RENDER_SCRIPT,
        "--",
        "--id", id,
        "--device", "GPU"
    ])


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
                        render(id)

        id = path.basename(viz)
        render(id)

    if not LOOP:
        break
