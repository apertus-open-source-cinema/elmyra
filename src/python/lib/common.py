'''Utility methods to ensure dependencies, setup defaults, remove, append ...'''

from os import path
import json

import bpy
from addon_utils import check

LIBRARY_PATH = path.join(path.dirname(__file__), '../../lib/elmyra')  # TODO: This has to be based on runtime_dir instead?


def append_from_library(blend, directory, item):
    blend_exp = f"{blend}.blend"

    # TODO: Which of the two now? Also: relative path without a reference location?
    # filepath = "//" + path.join(blend_exp, directory, '')
    filepath = path.join(LIBRARY_PATH, blend_exp, directory, '')

    filename = item
    directory = path.join(LIBRARY_PATH, blend_exp, directory, '')

    bpy.ops.wm.append(filepath=filepath,
                      directory=directory,
                      filename=filename,
                      autoselect=False)


def empty_scene():
    bpy.ops.object.select_all(action='DESELECT')

    for obj in bpy.context.scene.objects:
        obj.select_set(True)
        bpy.ops.object.delete()


def ensure_addons():
    # TODO: Persist addons being enabled as user settings (otherwise overhead!)

    is_enabled, is_loaded = check('render_freestyle_svg')
    if not is_enabled:
        bpy.ops.preferences.addon_enable(module='render_freestyle_svg')


def get_view3d_context():
    for area in bpy.context.screen.areas:
        if area.type == 'VIEW_3D':
            context = bpy.context.copy()
            context['area'] = area

            return context


def remove_object(name):
    bpy.ops.object.select_all(action='DESELECT')
    bpy.data.objects[name].select_set(True)
    bpy.ops.object.delete()


def open_scene(blend_path):
    bpy.ops.wm.open_mainfile(filepath=blend_path)


def setup_scene_defaults():
    bpy.context.scene.render.engine = 'CYCLES'

    bpy.context.scene.cycles.max_bounces = 2
    bpy.context.scene.cycles.preview_samples = 12

    bpy.context.scene.render.image_settings.file_format = 'PNG'
    bpy.context.scene.render.image_settings.color_mode = 'RGBA'
    bpy.context.scene.render.image_settings.compression = 0
    bpy.context.scene.render.film_transparent = True
    bpy.context.scene.use_nodes = True

    for mat in bpy.data.materials:
        mat.use_nodes = True
