from common import append_from_library

import bpy


def illustrated(options):
    append_from_library("illustrated", "FreestyleLineStyle", "Contour")
    append_from_library("illustrated", "FreestyleLineStyle", "Details")
    append_from_library("illustrated", "World", "illustrated")

    bpy.context.scene.render.use_freestyle = True

    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            obj.cycles_visibility.camera = False

    illustrated_world = bpy.data.worlds["illustrated"]
    bpy.context.scene.world = illustrated_world

    bpy.context.scene.cycles.film_transparent = False


def realistic(options):
    append_from_library("realistic", "Material", "realistic")
    append_from_library("realistic", "World", "realistic")

    realistic_material = bpy.data.materials["realistic"]
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            obj.data.materials.append(realistic_material)

    realistic_world = bpy.data.worlds["realistic"]
    bpy.context.scene.world = realistic_world


def setup(options):
    function = {
        "illustrated": illustrated,
        "realistic": realistic
    }[options.style_type]

    function(options)
