import bpy
import hashlib
import requests

from os import path, remove

import common
import meta


def import_model(url, scene):
    tmp_dirpath = path.join(path.dirname(__file__), 'tmp')
    network_url = None

    # Download a local copy if url not local, replace url, store original url as network_url
    if not path.exists(url):
        request = requests.get(url)

        if request.status_code == requests.codes.ok:
            local_filename = "{0}.{1}".format(scene,
                                              path.basename(url))
            local_url = path.join(tmp_dirpath, local_filename)

            with open(local_url, "wb") as file:
                file.write(request.content)

            network_url = url
            url = local_url
        else:
            return False

    # TODO: Extract file type from MIME as well, reject but inform user if unclear format is problem
    extension = path.splitext(url)[1]

    # TODO: Look in detail at each format, add more, tweak, remove as necessary
    # Known problem e.g.: Different state of selectedness, activeness after different importers
    if extension == '.stl':
        bpy.ops.import_mesh.stl(filepath=url)
    elif extension == '.ply':
        bpy.ops.import_mesh.ply(filepath=url)
    elif extension == '.3ds':
        bpy.ops.import_scene.autodesk_3ds(filepath=url)
    elif extension == '.fbx':
        bpy.ops.import_scene.fbx(filepath=url)
    elif extension == '.obj':
        bpy.ops.import_scene.obj(filepath=url)

        # TODO: After obj import everything imported is SELECTED but not ACTIVE
        #       This is because in contrast to .stl import we import a scene,
        #       not a single mesh/object, and thus the smoothing, modifier adding
        #       that happens afterwards here, needs to be performed on all the
        #       objects, or all objects need to be unified into one.
        #       Also this confronts elmyra with a weakness in design:
        #       Being centered around one object only ...
        #       Needs thinking.
    elif extension == '.dae':
        bpy.ops.wm.collada_import(filepath=url)
    else:
        return False

    bpy.ops.object.shade_smooth()
    bpy.ops.object.modifier_add(type='EDGE_SPLIT')

    bpy.context.active_object["elmyra-hash"] = get_hash_url(url)

    if network_url:
        bpy.context.active_object["elmyra-url"] = network_url

        # If downloaded from network url points to a local temporary copy
        remove(url)

    filepath = path.join(tmp_dirpath, scene)
    bpy.ops.wm.save_as_mainfile(filepath=filepath)

    return True


def import_scene(import_scene):
    filepath = path.join('tmp', import_scene)

    with bpy.data.libraries.load(filepath) as (data_from, data_to):
        data_to.objects = data_from.objects

    for obj in data_to.objects:
        if obj is not None:
            bpy.context.scene.objects.link(obj)

    # This is a temporarily created import scene not needed after importing!
    remove(filepath)


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
    filepath = path.join(tmp_dirpath, ".{0}.stl".format(data_hash))

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
        common.remove_object(obj_new_geometry.name)

        obj["elmyra-hash"] = new_hash

        return True
    else:
        return False


def update_geometry(obj, obj_new_geometry):

    # Transfer materials, modifiers with data links
    obj.select = True
    obj_new_geometry.select = True

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
    meta.write({"processing": "Updating models"})

    updates_occurred = False

    # Update existing models
    for obj in bpy.data.objects:
        if obj.get("elmyra-url") is not None:
            if update_object(obj):
                updates_occurred = True

    meta.write({"processing": False})

    return updates_occurred
