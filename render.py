import bpy

from glob import glob
from datetime import datetime
from natsort import natsorted
from os import makedirs, path, remove, rename
from subprocess import call
from time import time

from configuration import FFMPEG_PATH

import meta


SAMPLES_INITIAL = 8
SAMPLES_MULTIPLIER = 0.5
SAMPLES_CAP = 3200

QUALITY_PREVIEW = 32
QUALITY_PRODUCTION = 320

def render_frame(render_directory,
                 frame,
                 existing_samples,
                 additional_samples,
                 existing_frame=None):
    benchmark = time()

    bpy.context.scene.frame_current = frame
    bpy.context.scene.cycles.samples = additional_samples

    cache_filename = ".render-cache.png"
    cache_filepath = path.join(render_directory, cache_filename)

    bpy.context.scene.render.filepath = cache_filepath
    bpy.ops.render.render(write_still=True)

    if existing_frame:
        alpha = float(existing_samples) / float(existing_samples + additional_samples)

        merge_samples = existing_samples + additional_samples
        merge_filename = "{0:06}.{1}.png".format(frame, merge_samples)
        merge_filepath = path.join(render_directory, merge_filename)

        ffmpeg_call = [
            FFMPEG_PATH,
            "-y",
            "-i", existing_frame,
            "-i", cache_filepath,
            "-filter_complex",
            "[1:v][0:v]blend=all_expr='A*{0}+B*{1}'".format(alpha, 1 - alpha),
            merge_filepath
        ]

        call(ffmpeg_call)

        remove(existing_frame)
        remove(cache_filepath)

    else:
        rename_filename = "{0:06}.{1}.png".format(frame, additional_samples)
        rename_filepath = path.join(render_directory, rename_filename)

        rename(cache_filepath, rename_filepath)

    if (bpy.context.scene.render.use_freestyle and
        bpy.context.scene.svg_export.use_svg_export):

        svg_old_filepath = path.join(render_directory,
                                     "{0}{1:04}.svg".format(cache_filename, frame))
        svg_new_filepath = path.join(render_directory,
                                     "{0:06}.svg".format(frame))

        if existing_frame:
            remove(svg_new_filepath)

        rename(svg_old_filepath, svg_new_filepath)


    meta.write({
        "renderDevice": bpy.context.scene.cycles.device,
        "lastRenderedFrame": frame,
        "lastRenderDuration": time() - benchmark,
        "lastRender": datetime.now().isoformat(),
        "lastRenderedSamples": additional_samples
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

    rendered_frames = natsorted(glob(path.join(render_directory, "*.png")))
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
