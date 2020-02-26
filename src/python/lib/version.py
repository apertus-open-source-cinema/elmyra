import bpy

from glob import glob
from os import makedirs, path
from time import strftime

from lib.context import VISUALIZATIONS_DIR


def latest_version_dir(visualization_dir):
    versions_glob = path.join(visualization_dir, '*')
    ascending_version_dirs = sorted(glob(versions_glob))

    return ascending_version_dirs[-1]


def open_latest(visualization_dir):
    version_dir = latest_version_dir(visualization_dir)
    blend_file = path.join(version_dir, 'scene.blend')

    if path.exists(blend_file):
        bpy.ops.wm.open_mainfile(filepath=blend_file)

        return True
    else:
        return False


def save_new(id):
    version = strftime('%Y%m%dT%H%M')
    version_dir = path.join(VISUALIZATIONS_DIR, id, version)
    scene_file = path.join(version_dir, 'scene.blend')

    makedirs(version_dir)

    bpy.ops.file.pack_all()
    bpy.ops.wm.save_as_mainfile(filepath=scene_file)
