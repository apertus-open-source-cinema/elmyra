import bpy
import hashlib
import requests

from os import path, remove
from time import time

import common
import meta


def update_object(obj, min_interval):
    url = obj["elmyra-url"]
    last_hash = obj.get("elmyra-hash")
    last_updated = obj.get("elmyra-updated")

    if last_updated and min_interval and time() - last_updated < min_interval:
        return False
    else:
        if path.exists(url):
            with open(url, "rb") as file:
                stl = file.read()
        else:
            # Get binary file with requests library
            stl = requests.get(url).content

        hasher = hashlib.sha1()
        hasher.update(stl)
        new_hash = hasher.hexdigest()

        if new_hash == last_hash:
            obj["elmyra-updated"] = int(time())

            return False
        else:
            viz_dir = bpy.path.abspath("//")
            stl_path = path.join(viz_dir, ".{0}.stl".format(new_hash))

            with open(stl_path, "wb") as file:
                file.write(stl)

            bpy.ops.import_mesh.stl(filepath=stl_path)

            remove(stl_path)

            obj_new_geometry = bpy.context.scene.objects.active

            if obj.type == "EMPTY":
                common.remove_object(obj.name)
                obj = obj_new_geometry
            else:
                update_geometry(obj, obj_new_geometry)
                common.remove_object(obj_new_geometry.name)

            obj["elmyra-url"] = url
            obj["elmyra-hash"] = new_hash
            obj["elmyra-updated"] = int(time())

            return True


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



def update_models(options, min_interval=None):
    meta.write({"processing": "Updating models"})

    updates_occurred = False

    # First import - supplied via args
    if hasattr(options, "models"):
        for url in options.models.splitlines():
            bpy.ops.object.empty_add(type="CUBE")
            bpy.context.active_object["elmyra-url"] = url

        updates_occurred = True

    # Update existing models
    for obj in bpy.data.objects:
        if obj.get("elmyra-url") is not None:
            if update_object(obj, min_interval):
                updates_occurred = True

    meta.write({
        "processing": False,
        "update": {
            "lastUpdate": time(),
            "updatesOcurred": updates_occurred
        }
    })

    return updates_occurred
