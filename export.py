"""Methods for exporting to different formats"""
import bpy

from datetime import datetime
from glob import glob
from natsort import natsorted
from os import path
from shutil import copy
from subprocess import call
from time import time
from zipfile import ZipFile

import meta


def export_still():
    export_directory = bpy.path.abspath("//")
    image_directory = path.join(export_directory, "rendered_frames")


    ffmpeg_input_options = [
        "ffmpeg",
        "-y",
        "-f", "image2",
        "-pattern_type", "glob",
        "-framerate", "24",
        "-i", path.join(image_directory, "*.png")
    ]

    export_png(ffmpeg_input_options, export_directory)
    export_jpg(ffmpeg_input_options, export_directory)
    export_svg(image_directory, export_directory)


def export_jpg(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting JPG"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.jpg")
    ffmpeg_call = ffmpeg_input_options + [export_file]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "jpg": {
            "filePath": "exported.jpg",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_png(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting PNG"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.png")
    ffmpeg_call = ffmpeg_input_options + [export_file]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "png": {
            "filePath": "exported.png",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_svg(image_directory, export_directory):
    vector_input_files = glob(path.join(image_directory, "*.svg"))

    if len(vector_input_files) > 0:
        meta.write({"processing": "Exporting SVG"})
        benchmark = time()

        export_file = path.join(export_directory, "exported.svg")

        copy(vector_input_files[0], export_file)

        filesize = path.getsize(export_file)
        meta.write({
            "processing": False,
            "svg": {
                "filePath": "exported.svg",
                "exported": datetime.now().isoformat(),
                "processingTime": time() - benchmark,
                "fileSize": filesize
            }
        })


def export_animation():
    export_directory = bpy.path.abspath("//")
    image_directory = path.join(export_directory, "rendered_frames")
    rendered_frames = natsorted(glob(path.join(image_directory, "*.png")))
    concat_file = path.join(export_directory, "concat.txt")
    font_file = path.join(path.dirname(__file__), 'lib', 'elmyra', 'oxygen-mono.ttf')
    frame_duration = 1.0/24.0

    with open(concat_file, "w") as file:
        file.write("ffconcat version 1.0\n\n")

        for index, frame in enumerate(rendered_frames):
            filepath = path.join("rendered_frames", path.basename(frame))

            # Use the first available frame from the start of the animation
            if index == 0:
                number = bpy.context.scene.frame_start
            else:
                number = int(path.basename(frame).split(".")[0])

            # Expand the last available frame to the end of the animation
            if index == len(rendered_frames) - 1:
                next_number = bpy.context.scene.frame_end + 1
            else:
                next_frame = rendered_frames[index + 1]
                next_number = int(path.basename(next_frame).split(".")[0])

            # Write out the number of frames to interpolate (or exactly one)
            for _ in range(next_number - number):
                file.write("file {}\n".format(filepath))
                file.write("duration {}\n".format(frame_duration))

    ffmpeg_input_options = [
        "ffmpeg",
        "-y",
        "-f", "concat",
        "-i", path.join(export_directory, "concat.txt"),
    ]

    # Draw a 'PREVIEW HH:MM:SS:MS' overlay if there are missing frames
    # This serves 90% to take away the illusion of laggy video rendering
    # (not in there because the timestamp or preview information is so important)
    if len(rendered_frames) < bpy.context.scene.frame_end - bpy.context.scene.frame_start:
        drawtext_options = [
            "fontcolor=white",
            "fontfile={}".format(font_file),
            "fontsize=64",
            "text='PREVIEW %{pts\:hms}'",
            "x=(w-tw)/2",
            "y=h-(2*lh)",
            "box=1",
            "boxcolor=0x00000000@1"
        ]

        drawtext_filter = "drawtext=" + ":".join(drawtext_options)

        ffmpeg_input_options.append("-vf")
        ffmpeg_input_options.append(drawtext_filter)

    export_mp4(ffmpeg_input_options, export_directory)
    export_ogv(ffmpeg_input_options, export_directory)
    export_webm(ffmpeg_input_options, export_directory)
    export_gif(ffmpeg_input_options, export_directory)
    export_png_sequence(image_directory, export_directory)
    export_svg_sequence(image_directory, export_directory)


def export_mp4(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting MP4"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.mp4")
    ffmpeg_call = ffmpeg_input_options + [
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "4",
        export_file
    ]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "mp4": {
            "filePath": "exported.mp4",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_ogv(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting OGV"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.ogv")
    ffmpeg_call = ffmpeg_input_options + [
        "-codec:v", "libtheora",
        "-qscale:v", "10",
        export_file
    ]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "ogv": {
            "filePath": "exported.ogv",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_webm(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting WEBM"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.webm")
    ffmpeg_call = ffmpeg_input_options + [
        "-c:v", "libvpx",
        "-crf", "4",
        "-b:v", "32M",
        export_file
    ]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "webm": {
            "filePath": "exported.webm",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_gif(ffmpeg_input_options, export_directory):
    """Export a GIF from the input frames, scaled down to 720p"""

    meta.write({"processing": "Exporting GIF"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.gif")

    # GIF encoding technique taken from
    # http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html

    palette_file = path.join(export_directory, "palette.png")
    filters = "fps=15,scale=720:-1:flags=lanczos"

    ffmpeg_palette_call = ffmpeg_input_options + [
        "-vf", "{},palettegen".format(filters),
        palette_file
    ]

    ffmpeg_render_call = ffmpeg_input_options + [
        "-i", palette_file,
        "-lavfi", "{} [x]; [x][1:v] paletteuse".format(filters),
        export_file
    ]

    call(ffmpeg_palette_call)
    call(ffmpeg_render_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "gif": {
            "filePath": "exported.gif",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_png_sequence(image_directory, export_directory):
    """Export all input frames as PNGs inside a ZIP"""

    meta.write({"processing": "Exporting PNG Sequence"})
    benchmark = time()

    raster_input_files = glob(path.join(image_directory, "*.png"))
    export_file = path.join(export_directory, "exported.png.zip")

    zip_file = ZipFile(export_file, 'w')

    for frame in raster_input_files:
        zip_file.write(frame, path.basename(frame))

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "png.zip": {
            "filePath": "exported.png.zip",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_svg_sequence(image_directory, export_directory):
    vector_input_files = glob(path.join(image_directory, "*.svg"))

    if len(vector_input_files) > 0:
        meta.write({"processing": "Exporting SVG Sequence"})
        benchmark = time()

        export_file = path.join(export_directory, "exported.svg.zip")

        zip_file = ZipFile(export_file, 'w')

        for frame in vector_input_files:
            zip_file.write(frame, path.basename(frame))

        filesize = path.getsize(export_file)
        meta.write({
            "processing": False,
            "svg.zip": {
                "filePath": "exported.svg.zip",
                "exported": datetime.now().isoformat(),
                "processingTime": time() - benchmark,
                "fileSize": filesize
            }
        })


def export_web3d():
    meta.write({"processing": "Exporting HTML"})
    benchmark = time()

    export_directory = bpy.path.abspath("//")
    export_filepath = path.join(export_directory, "exported.html")

    bpy.ops.export_scene.b4w_html(filepath=export_filepath)

    filesize = path.getsize(export_filepath)
    meta.write({
        "processing": False,
        "html": {
            "filePath": "exported.html",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export():
    if bpy.context.scene.render.engine == "BLEND4WEB":
        export_web3d()
    else:
        if bpy.context.scene.frame_end > bpy.context.scene.frame_start:
            export_animation()
        else:
            export_still()
