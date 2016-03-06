import bpy

from glob import glob
from natsort import natsorted
from os import makedirs, path
from time import strftime


VISUALIZATIONS_PATH = path.join(path.dirname(__file__), "visualizations")


def all_versions(visualization):
    visualizations_directory = path.join(VISUALIZATIONS_PATH, visualization)
    versions = glob(path.join(visualizations_directory, "*"))

    return natsorted(versions)


def latest_version(visualization):
    return all_versions(visualization)[-1]


def open_new(blend_path):
    bpy.ops.wm.open_mainfile(filepath=blend_path)


def open_latest(visualization):
    filepath = path.join(VISUALIZATIONS_PATH,
                            visualization,
                            latest_version(visualization),
                            "scene.blend")

    bpy.ops.wm.open_mainfile(filepath=filepath)


def save_new(visualization):
    new_version = strftime("%Y%m%dT%H%M")
    directory = path.join(VISUALIZATIONS_PATH, visualization, new_version)

    if not path.exists(directory):
        makedirs(directory)

    filepath = path.join(directory, "scene.blend")

    bpy.ops.file.pack_all()
    bpy.ops.wm.save_as_mainfile(filepath=filepath)
