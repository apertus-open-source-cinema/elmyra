"""Methods to set media related (resolution, length) scene properties"""


import bpy


def setup(animated, width, height, length):
    """
    Sets up the type, resolution and length of the currently open scene

    The render resolution of the scene is set, and additionally ...

    ... for stills, sets the length of the scene to exactly 1 frame.

    ... for animations, enables animated seed for cycles, sets the fps to
    24 and the fps_base to 1.
    """

    bpy.context.scene.render.resolution_percentage = 100
    bpy.context.scene.render.resolution_x = int(width)
    bpy.context.scene.render.resolution_y = int(height)

    if not animated:
        bpy.context.scene.frame_end = 1
    else:
        bpy.context.scene.cycles.use_animated_seed = True
        bpy.context.scene.frame_end = length * 24
        bpy.context.scene.render.fps = 24

        # different for weird framerates (23.9243924 stuffies you know)
        bpy.context.scene.render.fps_base = 1
