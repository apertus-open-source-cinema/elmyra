"""Methods to set media related (resolution, length) scene properties"""


import bpy


def setup(media_type, width, height, length):
    """
    Sets up the type, resolution and length of the currently open scene

    The render resolution of the scene is set, and additionally ...

    ... for stills, sets the length of the scene to exactly 1 frame.

    ... for animations, enables animated seed for cycles, sets the fps to
    24 and the fps_base to 1.

    ... for web3d, sets the engine to BLEND4WEB.
    """

    bpy.context.scene.render.resolution_percentage = 100
    bpy.context.scene.render.resolution_x = int(width)
    bpy.context.scene.render.resolution_y = int(height)

    if media_type == "still":

        bpy.context.scene.frame_end = 1

    elif media_type == "animation":

        bpy.context.scene.cycles.use_animated_seed = True
        bpy.context.scene.frame_end = length * 24
        bpy.context.scene.render.fps = 24

        # different for weird framerates (23.9243924 stuffies you know)
        bpy.context.scene.render.fps_base = 1

    elif media_type == "web3d":

        bpy.context.scene.render.engine = 'BLEND4WEB'
