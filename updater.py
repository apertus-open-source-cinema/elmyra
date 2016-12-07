"""Tries to update all visualization models from their URLs, over and over"""

from glob import glob
from os import path
from subprocess import call

from common import platform_library


library = platform_library()

UPDATE_SCRIPT = path.join(path.dirname(__file__), 'blender_update.py')
DEFAULT_INTERVAL_SECONDS = 60 * 15 # 15 minutes (as seconds)
LOOP = False


def update(id):
    call([
        library["blender"],
        "--background",
        "--python", UPDATE_SCRIPT,
        "--",
        "--id", id,
        "--min-interval", str(DEFAULT_INTERVAL_SECONDS)
    ])


while True:
    for viz in glob("visualizations/*"):
        id = path.basename(viz)
        update(id)

    if not LOOP:
        break
