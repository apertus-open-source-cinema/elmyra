import bpy
import hashlib
import requests

from os import makedirs, path, remove
from shutil import copyfile

from lib import meta
from lib.common import append_from_library, remove_object, get_view3d_context
from lib.context import DATA_DIR, IMPORTS_DIR


def import_model(args):
    # TODO: Add a detailed error feedback path to the web interface (e.g. url 404ed etc.)

    upload_file = path.join(DATA_DIR, args.url)
    import_dir = path.join(IMPORTS_DIR, args.import_id)

    makedirs(import_dir)

    import_file = path.join(import_dir, f"source.{args.format}")
    import_preview = path.join(import_dir, "preview.obj")
    import_scene = path.join(import_dir, "imported.blend")


    # Copy or download the source file to the import directory
    if path.exists(upload_file):
        copyfile(upload_file, import_file)
    else:
        request = requests.get(args.url)

        if request.status_code == requests.codes.ok:
            with open(import_file, "wb") as file:
                file.write(request.content)
        else:
            return False

    # TODO: Look in detail at each format, add more, tweak, remove as necessary
    if args.format == "blend":
        # TODO: See .obj notes

        with bpy.data.libraries.load(import_file) as (data_from, data_to):
            data_to.objects = data_from.objects

        for obj in data_to.objects:
            if obj is not None and obj.type == "MESH":
                bpy.context.collection.objects.link(obj)
                bpy.context.view_layer.objects.active = obj
                obj.select_set(True)

    elif args.format == "stl":
        bpy.ops.import_mesh.stl(filepath=import_file)
    elif args.format == "ply":
        bpy.ops.import_mesh.ply(filepath=import_file)
    elif args.format == "3ds":
        bpy.ops.import_scene.autodesk_3ds(filepath=import_file)
    elif args.format == "fbx":
        bpy.ops.import_scene.fbx(filepath=import_file)
    elif args.format == "obj":
        bpy.ops.import_scene.obj(filepath=import_file)

        # TODO: After obj import everything imported is SELECTED but not ACTIVE
        #       This is because in contrast to .stl import we import a scene,
        #       not a single mesh/object, and thus the smoothing, modifier adding
        #       that happens afterwards here, needs to be performed on all the
        #       objects, or all objects need to be unified into one.
        #       Also this confronts elmyra with a weakness in design:
        #       Being centered around one object only ...
        #       Needs thinking.
    elif args.format == 'dae':
        bpy.ops.wm.collada_import(filepath=import_file)
    else:
        return False

    bpy.ops.object.shade_smooth()
    bpy.ops.object.modifier_add(type='EDGE_SPLIT')

    bpy.context.active_object['elmyra-hash'] = get_hash_url(import_file)
    bpy.context.active_object['elmyra-url'] = args.url

    bpy.ops.wm.save_as_mainfile(filepath=import_scene)

    export_browser_preview(import_preview)

    return True


def export_browser_preview(import_preview):
    # Place in center
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY')
    bpy.context.object.location = [0, 0, 0]

    # Normalize to size 1
    max_dimension = max(bpy.context.object.dimensions)
    bpy.context.object.scale[0] /= max_dimension
    bpy.context.object.scale[1] /= max_dimension
    bpy.context.object.scale[2] /= max_dimension
    bpy.ops.object.transform_apply(scale=True)

    face_count = len(bpy.context.object.data.polygons)
    if face_count > 64000:
        bpy.ops.object.modifier_add(type='DECIMATE')
        bpy.context.object.modifiers["Decimate"].ratio = 64000 / face_count
        bpy.ops.object.modifier_apply(apply_as='DATA', modifier="Decimate")

    # Append orientation widgets
    append_from_library("preview-widgets", "Object", "widget-flip-horizontally")
    append_from_library("preview-widgets", "Object", "widget-flip-vertically")
    append_from_library("preview-widgets", "Object", "widget-tilt")
    append_from_library("preview-widgets", "Object", "widget-turn")

    bpy.ops.object.select_all(action='SELECT')

    bpy.ops.export_scene.obj(filepath=import_preview,
                             check_existing=False,
                             use_materials=False,
                             axis_forward="Y",
                             axis_up="Z",
                             use_triangles=True)


def import_scene(import_id,
                 orient_flip_horizontally,
                 orient_flip_vertically,
                 orient_rotate_x,
                 orient_rotate_y,
                 orient_rotate_z):
    # TODO: This imports also camera, lights, etc. ...
    # TODO: Conceptually this imports one object, the code is like if there
    #       were many objects imported though, unclean, unclear.

    blend_file = path.join(IMPORTS_DIR, import_id, 'imported.blend')

    with bpy.data.libraries.load(blend_file) as (data_from, data_to):
        data_to.objects = data_from.objects

    for obj in data_to.objects:
        if obj is not None:
            bpy.context.collection.objects.link(obj)
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.mode_set(mode='EDIT')

            view3d_context = get_view3d_context()

            bpy.ops.mesh.select_all(view3d_context, action='SELECT')

            bpy.ops.transform.mirror(view3d_context,
                                     constraint_axis=(False,
                                                      orient_flip_horizontally == 'true',
                                                      orient_flip_vertically == 'true'))

            # We need to flip the normals if the mesh is mirrored
            # on one axis only (if mirrored on both we don't need to)
            if orient_flip_horizontally != orient_flip_vertically:
                bpy.ops.mesh.flip_normals(view3d_context)

            bpy.ops.transform.rotate(orient_axis='Z', value=orient_rotate_z)
            bpy.ops.transform.rotate(orient_axis='Y', value=orient_rotate_y)
            bpy.ops.transform.rotate(orient_axis='X', value=orient_rotate_x)

            bpy.ops.mesh.select_all(view3d_context, action='DESELECT')
            bpy.ops.object.mode_set(mode='OBJECT')


def get_stl(url):
    if path.exists(url):
        with open(url, "rb") as file:
            return file.read()
    else:
        # Get binary file with requests library
        return requests.get(url).content


def get_hash_url(url):
    with open(url, "rb") as file:
        data = file.read()
        hasher = hashlib.sha1()
        hasher.update(data)
        return hasher.hexdigest()


def get_hash(data):
    hasher = hashlib.sha1()
    hasher.update(data)
    return hasher.hexdigest()


def temp_write(data, data_hash):
    tmp_dirpath = path.join(path.dirname(__file__), 'tmp')
    filepath = path.join(tmp_dirpath, f".{data_hash}.stl")

    with open(filepath, "wb") as file:
        file.write(data)

    return filepath


def update_object(obj):
    stl = get_stl(obj["elmyra-url"])
    new_hash = get_hash(stl)

    if new_hash != obj["elmyra-hash"]:
        stl_filepath = temp_write(stl, new_hash)

        bpy.ops.import_mesh.stl(filepath=stl_filepath)
        bpy.ops.object.shade_smooth()

        remove(stl_filepath)

        obj_new_geometry = bpy.context.scene.objects.active
        update_geometry(obj, obj_new_geometry)
        remove_object(obj_new_geometry.name)

        obj["elmyra-hash"] = new_hash

        return True
    else:
        return False


def update_geometry(obj, obj_new_geometry):

    # Transfer materials, modifiers with data links
    obj.select_set(True)
    obj_new_geometry.select_set(True)

    bpy.context.scene.objects.active = obj
    bpy.ops.object.make_links_data(type='MATERIAL')
    bpy.ops.object.make_links_data(type='MODIFIERS')

    # Transfer all sorts of stuff with the Transfer Mesh Data operator
    bpy.context.scene.objects.active = obj_new_geometry
    bpy.ops.object.data_transfer(data_type='SHARP_EDGE', use_object_transform=False)
    bpy.ops.object.data_transfer(data_type='CREASE', use_object_transform=True)
    bpy.ops.object.data_transfer(data_type='BEVEL_WEIGHT_EDGE', use_object_transform=False)
    bpy.ops.object.data_transfer(data_type='FREESTYLE_EDGE', use_object_transform=True)
    bpy.ops.object.data_transfer(data_type='VCOL', use_object_transform=False)
    bpy.ops.object.data_transfer(data_type='UV', loop_mapping='POLYINTERP_NEAREST', use_object_transform=True)
    bpy.ops.object.data_transfer(data_type='SMOOTH', use_object_transform=False)
    bpy.ops.object.data_transfer(data_type='VGROUP_WEIGHTS', use_object_transform=False, layers_select_src='ALL', layers_select_dst='NAME')

    obj.data = obj_new_geometry.data

    # TODO: Rewrite after data transfer modifer bugfix (decide between operator and modifier as well)
    # Pro modifier: User could manually tweak transfer after the fact ...
    # Transfer things with data transfer modifier

    # bpy.ops.object.select_all(action="DESELECT")
    # bpy.context.scene.objects.active = some_obj_rewrite this please

    # Transfer UV coordinates
    # bpy.ops.object.modifier_add(type='DATA_TRANSFER')
    # bpy.context.object.modifiers["DataTransfer"].object = old_obj
    # bpy.context.object.modifiers["DataTransfer"].use_object_transform = False
    # bpy.context.object.modifiers["DataTransfer"].use_loop_data = True
    # bpy.context.object.modifiers["DataTransfer"].loop_mapping = 'POLYINTERP_NEAREST'
    # bpy.context.object.modifiers["DataTransfer"].data_types_loops_uv = {'UV'}
    # bpy.ops.object.datalayout_transfer(modifier="DataTransfer")
    # bpy.ops.object.modifier_apply(apply_as='DATA', modifier="DataTransfer")
    #
    # # Transfer smoothing
    # bpy.ops.object.modifier_add(type='DATA_TRANSFER')
    # bpy.context.object.modifiers["DataTransfer"].object = old_obj
    # bpy.context.object.modifiers["DataTransfer"].use_object_transform = False
    # bpy.context.object.modifiers["DataTransfer"].use_poly_data = True
    # bpy.context.object.modifiers["DataTransfer"].data_types_polys = {'SMOOTH'}
    # bpy.ops.object.datalayout_transfer(modifier="DataTransfer")
    # bpy.ops.object.modifier_apply(apply_as='DATA', modifier="DataTransfer")
    #
    # # Transfer sharp edges
    # bpy.ops.object.modifier_add(type='DATA_TRANSFER')
    # bpy.context.object.modifiers["DataTransfer"].object = old_obj
    # bpy.context.object.modifiers["DataTransfer"].use_object_transform = False
    # bpy.context.object.modifiers["DataTransfer"].use_edge_data = True
    # bpy.context.object.modifiers["DataTransfer"].data_types_edges = {'SHARP_EDGE'}
    # bpy.ops.object.datalayout_transfer(modifier="DataTransfer")
    # bpy.ops.object.modifier_apply(apply_as='DATA', modifier="DataTransfer")


    # TODO: Transfer material ASSIGNMENT, split object
    # bpy.ops.mesh.uv_texture_add()
    # bpy.context.object.data.active_index = 0
    # bpy.context.object.data.uv_textures["MATERIAL_TRANSFER_666"].name = "MATERIAL_TRANSFER_666"
    # bpy.ops.object.editmode_toggle()



def update_models():
    meta.write({ 'processing': 'Updating models' })

    updates_occurred = False

    # Update existing models
    for obj in bpy.data.objects:
        if obj.get('elmyra-url') is not None:
            if update_object(obj):
                updates_occurred = True

    meta.write({ 'processing': None })

    return updates_occurred
