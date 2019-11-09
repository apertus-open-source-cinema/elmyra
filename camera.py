import bpy

from common import append_from_library, get_view3d_context
from functools import reduce
from mathutils import Vector


def align_info():
    corners = []
    for obj in bpy.data.objects:
        for corner in obj.bound_box:
            corners.append(obj.matrix_world * Vector(corner))

    center = reduce(lambda m, n: m + n, corners) / len(corners)
    radius = max([(corner - center).length for corner in corners])

    return center, radius


def create_camera_rig():
    bpy.ops.curve.primitive_bezier_circle_add(location=(0, 0, 0), radius=1)
    bpy.context.object.name = 'elmyra_camera_rig_mount'

    bpy.ops.object.empty_add(location=(0, 0, 0), type='PLAIN_AXES')
    bpy.context.object.name = 'elmyra_camera_rig_target'

    bpy.ops.object.camera_add(location=(0, 0, 0))
    bpy.context.object.name = 'elmyra_camera_rig_camera'

    bpy.ops.object.constraint_add(type='FOLLOW_PATH')
    bpy.context.object.constraints['Follow Path'].target = bpy.data.objects['elmyra_camera_rig_mount']
    bpy.context.object.constraints['Follow Path'].name = 'elmyra_follow_mount'

    bpy.ops.object.constraint_add(type='TRACK_TO')
    bpy.context.object.constraints['Track To'].target = bpy.data.objects['elmyra_camera_rig_target']
    bpy.context.object.constraints['Track To'].track_axis = 'TRACK_NEGATIVE_Z'
    bpy.context.object.constraints['Track To'].up_axis = 'UP_Y'
    bpy.context.object.constraints['Track To'].name = 'elmyra_track_target'


def fixed(options):
    # TODO: Let the user position the camera in the browser, use his values
    center, radius = align_info()

    bpy.ops.object.camera_add(location=(0, 0, 0))
    bpy.context.object.name = 'elmyra_camera'

    bpy.data.objects['elmyra_camera'].data.clip_start = 0.01
    bpy.data.objects['elmyra_camera'].data.clip_end = radius * 9
    bpy.context.scene.camera = bpy.data.objects['elmyra_camera']

    bpy.data.objects['elmyra_camera'].location = (center.x + radius * 3, center.y, center.z + radius * 1.4)

    # Auto fit to viewport
    view3d_context = get_view3d_context()

    for obj in bpy.data.objects:
        obj.select = True

    bpy.ops.view3d.camera_to_view_selected(view3d_context)


def turntable(options):
    center, radius = align_info()

    create_camera_rig()

    bpy.data.objects['elmyra_camera_rig_camera'].data.clip_start = 0.01
    bpy.data.objects['elmyra_camera_rig_camera'].data.clip_end = radius * 9
    bpy.context.scene.camera = bpy.data.objects['elmyra_camera_rig_camera']

    bpy.data.objects['elmyra_camera_rig_target'].location = center
    bpy.data.objects['elmyra_camera_rig_mount'].location = (center.x, center.y, center.z + radius * 1.4)
    bpy.data.objects['elmyra_camera_rig_mount'].scale = (radius * 3, radius * 3, radius * 3)

    bpy.context.scene.frame_current = 1
    bpy.data.objects['elmyra_camera_rig_camera'].constraints['elmyra_follow_mount'].offset = 0
    bpy.data.objects['elmyra_camera_rig_camera'].constraints['elmyra_follow_mount'].keyframe_insert(data_path='offset')

    bpy.context.scene.frame_current = bpy.context.scene.frame_end
    bpy.data.objects['elmyra_camera_rig_camera'].constraints['elmyra_follow_mount'].offset = 100
    bpy.data.objects['elmyra_camera_rig_camera'].constraints['elmyra_follow_mount'].keyframe_insert(data_path='offset')

    for fc in bpy.data.objects['elmyra_camera_rig_camera'].animation_data.action.fcurves:
        fc.extrapolation = 'LINEAR'
        for kp in fc.keyframe_points:
            kp.interpolation = 'LINEAR'


def helix(options):
    center, radius = align_info()
    helix_scale = (radius * 3, radius * 3, radius * 3)

    create_camera_rig()

    bpy.data.objects['elmyra_camera_rig_camera'].data.clip_start = 0.01
    bpy.data.objects['elmyra_camera_rig_camera'].data.clip_end = radius * 9
    bpy.context.scene.camera = bpy.data.objects['elmyra_camera_rig_camera']

    bpy.data.objects['elmyra_camera_rig_target'].location = center
    bpy.data.objects['elmyra_camera_rig_mount'].scale = helix_scale

    low_camera = (center.x, center.y, center.z - radius * 2)
    high_camera = (center.x, center.y, center.z + radius * 2)

    # Keyframe at the beginning - lowest point, follow circle 0%
    bpy.context.scene.frame_current = 1
    bpy.data.objects['elmyra_camera_rig_mount'].location = low_camera
    bpy.data.objects['elmyra_camera_rig_mount'].keyframe_insert(data_path='location')
    bpy.data.objects['elmyra_camera_rig_camera'].constraints['elmyra_follow_mount'].offset = 0
    bpy.data.objects['elmyra_camera_rig_camera'].constraints['elmyra_follow_mount'].keyframe_insert(data_path='offset')

    # Keyframe in the middle - highest point, follow circle 100%
    bpy.context.scene.frame_current = bpy.context.scene.frame_end / 2
    bpy.data.objects['elmyra_camera_rig_mount'].location = high_camera
    bpy.data.objects['elmyra_camera_rig_mount'].keyframe_insert(data_path='location')

    # Keyframe at the end - lowest point, follow circle 200%
    bpy.context.scene.frame_current = bpy.context.scene.frame_end
    bpy.data.objects['elmyra_camera_rig_mount'].location = low_camera
    bpy.data.objects['elmyra_camera_rig_mount'].keyframe_insert(data_path='location')
    bpy.data.objects['elmyra_camera_rig_camera'].constraints['elmyra_follow_mount'].offset = 200
    bpy.data.objects['elmyra_camera_rig_camera'].constraints['elmyra_follow_mount'].keyframe_insert(data_path='offset')

    # Make only the follow circle animation progression perfectly linear
    for fc in bpy.data.objects['elmyra_camera_rig_camera'].animation_data.action.fcurves:
        fc.extrapolation = 'LINEAR'
        for kp in fc.keyframe_points:
            kp.interpolation = 'LINEAR'


def setup(options):
    if options.camera_type == 'fixed':
        fixed(options)
    elif options.camera_type == 'turntable':
        turntable(options)
    else: # options.camera_type == 'helix'
        helix(options)
