import bpy
import json

from os import path


def get():
    blend_filepath = bpy.path.abspath("//")
    meta_filepath = path.join(blend_filepath, "meta.json")

    if path.exists(meta_filepath):
        with open(meta_filepath) as file:
            return json.loads(file.read())
    else:
        return {}

def write(attributes):
    blend_path = bpy.path.abspath("//")
    meta_path = path.join(blend_path, "meta.json")

    meta = {}

    if path.exists(meta_path):
        with open(meta_path) as file:
            meta = json.loads(file.read())

    meta.update(attributes)

    with open(meta_path, "w") as file:
        file.write(json.dumps(meta, indent=2))


def write_media_info():
    if bpy.context.scene.frame_end > bpy.context.scene.frame_start:
        num_frames = bpy.context.scene.frame_end - bpy.context.scene.frame_start
        media_length = round(num_frames / bpy.context.scene.render.fps)
        media_type = "animation"
    else:
        media_length = 0
        media_type = "still"


    write({
        "mediaWidth": bpy.context.scene.render.resolution_x,
        "mediaHeight": bpy.context.scene.render.resolution_y,
        "mediaLength":  media_length,
        "mediaType": media_type,
        "mediaFps": bpy.context.scene.render.fps,
        "mediaFrameCount": bpy.context.scene.frame_end
    })
