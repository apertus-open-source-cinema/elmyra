import bpy
import json

from os import path

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
    write({
        "mediaWidth": bpy.context.scene.render.resolution_x,
        "mediaHeight": bpy.context.scene.render.resolution_y,
        "mediaLength": round((bpy.context.scene.frame_end - bpy.context.scene.frame_start) / 24) if bpy.context.scene.frame_end > bpy.context.scene.frame_start else 0,
        "mediaType": "animation" if bpy.context.scene.frame_end > bpy.context.scene.frame_start else "still",
        "mediaFps": bpy.context.scene.render.fps,
        "mediaFrameCount": bpy.context.scene.frame_end
    })
