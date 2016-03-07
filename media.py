import bpy


def setup_animation(options):
    bpy.context.scene.cycles.use_animated_seed = True
    bpy.context.scene.frame_end = options.media_length * 24
    bpy.context.scene.render.fps = 24
    bpy.context.scene.render.fps_base = 1 # different for weird framerates (23.9243924 stuffies you know)


def setup_resolution(options):
    bpy.context.scene.render.resolution_percentage = 100
    bpy.context.scene.render.resolution_x = int(options.media_width)
    bpy.context.scene.render.resolution_y = int(options.media_height)


def setup_still(options):
    bpy.context.scene.frame_end = 1


def setup_web3d(options):
    pass


def setup(options):
    setup_resolution(options)

    function = {
        "animation": setup_animation,
        "still": setup_still,
        "web3d": setup_web3d
    }[options.media_type]

    function(options)
