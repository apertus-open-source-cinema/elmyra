import bpy

from common import append_from_library, remove_object
from functools import reduce
from math import radians
from mathutils import Vector


def align_info():
    corners = []
    for obj in bpy.data.objects:
        for corner in obj.bound_box:
            corners.append(obj.matrix_world * Vector(corner))

    center = reduce(lambda m, n: m + n, corners) / len(corners)
    radius = max([(corner - center).length for corner in corners])

    return center, radius


def user(options):
    pass
    # bpy.ops.object.camera_add()
    # bpy.context.scene.camera = bpy.data.objects["Camera"]
    #
    # location = options['location']
    # rotation = options['rotation']
    # focal_length = options['lens']['focal_length']
    # lens_type = options['lens']['type']
    #
    # bpy.data.objects["Camera"].data.clip_end = 300
    #
    # bpy.context.scene.camera.location[0] = location[0]
    # bpy.context.scene.camera.location[1] = location[1]
    # bpy.context.scene.camera.location[2] = location[2]
    # bpy.context.scene.camera.rotation_euler[0] = rotation[0]
    # bpy.context.scene.camera.rotation_euler[1] = rotation[1]
    # bpy.context.scene.camera.rotation_euler[2] = rotation[2]
    # bpy.context.scene.camera.data.lens = focal_length
    # bpy.context.scene.camera.data.type = lens_type


def fixed(options):
    # TODO: Let the user position the camera in the browser, use his values
    center, radius = align_info()

    bpy.ops.object.camera_add()


    bpy.data.objects["Camera"].data.clip_start = 0.01
    bpy.data.objects["Camera"].data.clip_end = radius * 9
    bpy.context.scene.camera = bpy.data.objects["Camera"]

    bpy.data.objects["Camera"].location = (center.x + radius * 3,
                                                      center.y,
                                                      center.z + radius * 1.4)

    # Auto fit to viewport
    for area in bpy.context.screen.areas:
        if area.type == 'VIEW_3D':
            override = bpy.context.copy()
            override['area'] = area

            # Frame selected objects
            for obj in bpy.data.objects:
                obj.select = True
            bpy.ops.view3d.camera_to_view_selected(override)

            # Select camera and move back PROBABLY DROPPABLE
            ## bpy.ops.object.select_camera(override)
            ## bpy.ops.transform.translate(override,
            ## value=(10, 0, 0), constraint_axis=(False, False, True),
            ## constraint_orientation='LOCAL')


def turntable(options):
    center, radius = align_info()

    append_from_library("helix", "Object", "Camera")

    bpy.data.objects["Camera"].data.clip_start = 0.01
    bpy.data.objects["Camera"].data.clip_end = radius * 9
    bpy.context.scene.camera = bpy.data.objects["Camera"]

    bpy.data.objects["Camera-Helix-LookAt"].location = center
    bpy.data.objects["Camera-Helix-Ring"].location = (center.x,
                                                      center.y,
                                                      center.z + radius * 1.4)
    bpy.data.objects["Camera-Helix-Ring"].scale = (radius * 3,
                                                   radius * 3,
                                                   radius * 3)

    bpy.context.scene.frame_current = 1
    bpy.data.objects["Camera"].constraints["Follow Path"].offset = 0
    bpy.data.objects["Camera"].constraints["Follow Path"].keyframe_insert(data_path="offset")

    bpy.context.scene.frame_current = bpy.context.scene.frame_end
    bpy.data.objects["Camera"].constraints["Follow Path"].offset = 100
    bpy.data.objects["Camera"].constraints["Follow Path"].keyframe_insert(data_path="offset")

    for fc in bpy.data.objects["Camera"].animation_data.action.fcurves:
        fc.extrapolation = "LINEAR"
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"


def helix(options):
    center, radius = align_info()

    append_from_library("helix", "Object", "Camera")

    bpy.data.objects["Camera"].data.clip_start = 0.01
    bpy.data.objects["Camera"].data.clip_end = radius * 9
    bpy.context.scene.camera = bpy.data.objects["Camera"]

    bpy.data.objects["Camera-Helix-LookAt"].location = center
    bpy.data.objects["Camera-Helix-Ring"].scale = (radius * 3,
                                                   radius * 3,
                                                   radius * 3)

    bpy.context.scene.frame_current = 1
    bpy.data.objects["Camera-Helix-Ring"].location = (center.x,
                                                      center.y,
                                                      center.z - radius * 2)
    bpy.data.objects["Camera-Helix-Ring"].keyframe_insert(data_path="location")
    bpy.data.objects["Camera"].constraints["Follow Path"].offset = 0
    bpy.data.objects["Camera"].constraints["Follow Path"].keyframe_insert(data_path="offset")

    bpy.context.scene.frame_current = bpy.context.scene.frame_end
    bpy.data.objects["Camera-Helix-Ring"].location = (center.x,
                                                      center.y,
                                                      center.z + radius * 2)
    bpy.data.objects["Camera-Helix-Ring"].keyframe_insert(data_path="location")
    bpy.data.objects["Camera"].constraints["Follow Path"].offset = 100
    bpy.data.objects["Camera"].constraints["Follow Path"].keyframe_insert(data_path="offset")

    for fc in bpy.data.objects["Camera"].animation_data.action.fcurves:
        fc.extrapolation = "LINEAR"
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"

    for fc in bpy.data.objects["Camera-Helix-Ring"].animation_data.action.fcurves:
        fc.extrapolation = "LINEAR"
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"


def dolly(options):
    pass


def setup(options):
    function = {
        "user": user,
        "fixed": fixed,
        "turntable": turntable,
        "helix": helix,
        "dolly": dolly
    }[options.camera_type]

    function(options)
