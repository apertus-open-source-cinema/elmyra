import bpy

from glob import glob
from datetime import datetime
from natsort import natsorted
from os import makedirs, path, remove
from PIL import Image
from time import time

import meta


SAMPLES_INITIAL = 8
SAMPLES_MULTIPLIER = 0.5
SAMPLES_CAP = 3200

QUALITY_PREVIEW = 32
QUALITY_PRODUCTION = 320


def render_frame(render_directory, frame, samples, sample_step, stack_frame=None):
    benchmark = time()

    bpy.context.scene.frame_current = frame
    bpy.context.scene.cycles.samples = sample_step

    if stack_frame:
        filepath = path.join("//rendered_frames", ".render-cache.png")
        bpy.context.scene.render.filepath = filepath
        bpy.ops.render.render(write_still=True)

        stack_image = Image.open(stack_frame)
        stack_samples = samples

        blend_image = Image.open(path.join(render_directory, ".render-cache.png"))
        blend_samples = sample_step

        alpha = float(stack_samples) / float(stack_samples + blend_samples)

        stack_image = Image.blend(blend_image, stack_image, alpha)
        stack_samples = stack_samples + blend_samples

        blend_image.close()
        remove(path.join(render_directory, ".render-cache.png"))

        stack_filename = "{0:06}.{1}.png".format(frame, stack_samples)
        stack_image.save(path.join(render_directory, stack_filename))

        stack_image.close()
        remove(stack_frame)

    else:
        filename = "{0:06}.{1}.png".format(frame, sample_step)
        filepath = path.join("//rendered_frames", filename)
        bpy.context.scene.render.filepath = filepath
        bpy.ops.render.render(write_still=True)

    meta.write({
        "renderDevice": bpy.context.scene.cycles.device,
        "lastRenderedFrame": frame,
        "lastRenderDuration": time() - benchmark,
        "lastRender": datetime.now().isoformat(),
        "lastRenderedSamples": sample_step
    })

def render(abandon_after=60, device="GPU"):
    benchmark = time()

    bpy.context.scene.cycles.seed = int(benchmark) # Imagestacking random seed
    bpy.context.scene.cycles.device = device

    render_directory = path.join(bpy.path.abspath("//"), "rendered_frames")

    if not path.exists(render_directory):
        makedirs(render_directory)

    first = bpy.context.scene.frame_start
    last = bpy.context.scene.frame_end
    total_frames = last - first + 1

    rendered_frames = natsorted(glob(path.join(render_directory, "*")))
    requested_frames = []

    if len(rendered_frames) < total_frames:
        meta.write({"processing": "Rendering missing frames"})

        for number in range(first + len(rendered_frames), last + 1):
            requested_frames.append({
                "number": number,
                "available_samples": 0,
                "requested_samples": SAMPLES_INITIAL,
                "available_frame": None
            })
    else:
        samples = [int(path.basename(r).split(".")[1]) for r in rendered_frames]
        min_samples = min(samples)
        max_samples = max(samples)

        if min_samples < QUALITY_PREVIEW:
            render_quality = "draft"
        elif min_samples > QUALITY_PREVIEW:
            render_quality = "preview"
        elif min_samples > QUALITY_PRODUCTION:
            render_quality = "production"

        meta.write({
            "processing": "Rendering more samples",
            "minimumSamples": min_samples,
            "renderQuality": render_quality
        })

        if min_samples != max_samples:
            for frame in rendered_frames:
                frame_info = path.basename(frame).split(".")
                frame_number = int(frame_info[0])
                frame_samples = int(frame_info[1])

                if frame_samples < max_samples:
                    requested_frames.append({
                        "number": frame_number,
                        "available_samples": frame_samples,
                        "requested_samples": max_samples - frame_samples,
                        "available_frame": frame
                    })

        elif min_samples < SAMPLES_CAP:
            for frame in rendered_frames:
                frame_info = path.basename(frame).split(".")
                frame_number = int(frame_info[0])

                requested_frames.append({
                    "number": frame_number,
                    "available_samples": min_samples,
                    "requested_samples": min_samples * SAMPLES_MULTIPLIER,
                    "available_frame": frame
                })

    for frame in requested_frames:
        render_frame(render_directory,
                     frame["number"],
                     frame["available_samples"],
                     frame["requested_samples"],
                     frame["available_frame"])

        if time() - benchmark > abandon_after:
            break

    meta.write({"processing": False})
