import os
import subprocess

from glob import glob
from os import path
from subprocess import call

from configuration import BLENDER_PATH


UPDATE_SCRIPT = path.join(path.dirname(__file__), 'updater-blender.py')
DEFAULT_INTERVAL_SECONDS = 60 * 15 # 15 minutes (as seconds)
LOOP = False


def update(id):
    call([
        BLENDER_PATH,
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
