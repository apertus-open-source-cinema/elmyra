"""Utility methods to ensure dependencies, setup defaults, remove, append ..."""


import bpy
from addon_utils import check

from os import path

LIBRARY_PATH = path.join(path.dirname(__file__), "lib", "elmyra")


def append_from_library(blend, directory, item):
    blend_exp = "{0}.blend".format(blend)
    filepath = "//" + path.join(blend_exp, directory, '')
    filename = item
    directory = path.join(LIBRARY_PATH, blend_exp, directory, '')

    bpy.ops.wm.append(filepath=filepath,
                      directory=directory,
                      filename=filename,
                      autoselect=False)


def ensure_addons():
    # TODO: Persist addons being enabled as user settings (otherwise overhead!)

    for addon in ('blend4web', 'render_freestyle_svg'):
        is_enabled, is_loaded = check(addon)
        if not is_enabled:
            bpy.ops.wm.addon_enable(module=addon)


def remove_object(name):
    bpy.ops.object.select_all(action="DESELECT")
    bpy.data.objects[name].select = True
    bpy.ops.object.delete()


def setup_default_scene():
    for obj in ["Cube", "Lamp", "Camera"]:
        remove_object(obj)

    bpy.context.scene.render.engine = "CYCLES"

    bpy.context.scene.cycles.min_bounces = 1
    bpy.context.scene.cycles.max_bounces = 2
    bpy.context.scene.cycles.preview_samples = 12

    bpy.context.scene.render.image_settings.file_format = 'PNG'
    bpy.context.scene.render.image_settings.color_mode = 'RGBA'
    bpy.context.scene.render.image_settings.compression = 0
    bpy.context.scene.cycles.film_transparent = True
    bpy.context.scene.use_nodes = True

    # Multisampling for HDRI Lighting
    bpy.context.scene.world.cycles.sample_as_light = True
    bpy.context.scene.world.cycles.sample_map_resolution = 2048

    for mat in bpy.data.materials:
        mat.use_nodes = True
