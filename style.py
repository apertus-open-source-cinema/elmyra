"""Methods to set style-related properties on the objects and scene"""


from common import append_from_library

import bpy


def setup_illustrated():
    append_from_library("illustrated", "FreestyleLineStyle", "Contour")
    append_from_library("illustrated", "FreestyleLineStyle", "Details")
    append_from_library("illustrated", "World", "illustrated")

    bpy.context.scene.render.use_freestyle = True
    bpy.context.scene.svg_export.use_svg_export = True

    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            obj.cycles_visibility.camera = False

    illustrated_world = bpy.data.worlds["illustrated"]
    bpy.context.scene.world = illustrated_world

    bpy.context.scene.cycles.film_transparent = False


def setup_realistic():
    append_from_library("realistic", "Material", "realistic")
    append_from_library("realistic", "World", "realistic")

    realistic_material = bpy.data.materials["realistic"]
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            obj.data.materials.append(realistic_material)

    realistic_world = bpy.data.worlds["realistic"]
    bpy.context.scene.world = realistic_world


def setup_realtime():
    append_from_library("realtime", "Material", "Object")
    append_from_library("realtime", "World", "realtime")

    realtime_material = bpy.data.materials["Object"]
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            obj.data.materials.append(realtime_material)

    realtime_world = bpy.data.worlds["realtime"]
    bpy.context.scene.world = realtime_world

    append_from_library("realtime", "Object", "Plane")


def setup(style_type):
    if style_type == "illustrated":
        setup_illustrated()
    elif style_type == "realistic":
        setup_realistic()
    elif style_type == "realtime":
        setup_realtime()
