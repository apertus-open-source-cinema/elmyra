import bpy
import hashlib
import requests

from os import path, remove

import common
import meta


def get_stl(url):
    if path.exists(url):
        with open(url, "rb") as file:
            return file.read()
    else:
        # Get binary file with requests library
        return requests.get(url).content

def get_hash(data):
    hasher = hashlib.sha1()
    hasher.update(data)
    return hasher.hexdigest()


def temp_write(data, data_hash):
    # TODO: Write temporary files somewhere else than elmyra's root
    temp_dirpath = path.dirname(__file__)
    filepath = path.join(temp_dirpath, ".{0}.stl".format(data_hash))

    with open(filepath, "wb") as file:
        file.write(data)

    return filepath


def generate_objects(urls):
    for url in urls:
        stl = get_stl(url)
        initial_hash = get_hash(stl)

        stl_filepath = temp_write(stl, initial_hash)

        bpy.ops.import_mesh.stl(filepath=stl_filepath)
        bpy.ops.object.shade_smooth()
        bpy.ops.object.modifier_add(type='EDGE_SPLIT')

        bpy.context.active_object["elmyra-url"] = url
        bpy.context.active_object["elmyra-hash"] = initial_hash

        remove(stl_filepath)


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
