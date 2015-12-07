from glob import glob
from os import path
from subprocess import call


RENDER_SCRIPT = path.join(path.dirname(__file__), 'renderer-blender.py')
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
        id = path.basename(viz)
        render(id)

    if not LOOP:
        break
