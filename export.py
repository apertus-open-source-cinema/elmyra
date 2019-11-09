"""Methods for exporting to different formats"""
import bpy

from datetime import datetime
from glob import glob
from natsort import natsorted
from os import path
from shutil import copy
from time import time
from zipfile import ZipFile

import subprocess

from common import platform_library
import meta


library = platform_library()


def export_still():
    export_directory = bpy.path.abspath("//")
    image_directory = path.join(export_directory, "rendered_frames")
    pixel_image = glob(path.join(image_directory, "*.png"))[0]

    ffmpeg_input_options = [
        library["ffmpeg"],
        "-y",
        "-i", pixel_image
    ]

    export_png(ffmpeg_input_options, export_directory)
    export_jpg(ffmpeg_input_options, export_directory)
    export_svg(image_directory, export_directory)


def export_jpg(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting JPG"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.jpg")
    ffmpeg_call = ffmpeg_input_options + [export_file]

    subprocess.run(ffmpeg_call)

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

    subprocess.run(ffmpeg_call)

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
    concat_file = path.join(export_directory, "export.concat").replace("\\", "/") # POSIX style paths required on all platforms
    font_file = path.join(path.dirname(__file__), 'lib', 'elmyra', 'oxygen-mono.ttf').replace("\\", "/") # POSIX style paths required on all platforms
    frame_duration = 1.0/24.0

    with open(concat_file, "w") as file:
        file.write("ffconcat version 1.0\n\n")

        for index, frame in enumerate(rendered_frames):
            filepath = path.join("rendered_frames", path.basename(frame)).replace("\\", "/") # POSIX style paths required on all platforms

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
                file.write(f"file {filepath}\n")
                file.write(f"duration {frame_duration}\n")

    size_string = f"{bpy.context.scene.render.resolution_x}x{bpy.context.scene.render.resolution_y}"

    filter_string = ("color=c=black:s=" + size_string + " [black];"
                     "[black][0:v] overlay=shortest=1")

    # Draw a 'PREVIEW HH:MM:SS:MS' overlay if there are missing frames
    # This serves 90% to take away the illusion of laggy video rendering
    # (not in there because the timestamp or preview information is so important)
    if len(rendered_frames) < bpy.context.scene.frame_end - bpy.context.scene.frame_start:
        filter_string += (", drawtext=fontcolor=white:"
                                     "fontfile=" + font_file + ":"
                                     "fontsize=64:"
                                     "text='PREVIEW %{pts\:hms}':"
                                     "x=(w-tw)/2:"
                                     "y=h-(2*lh):"
                                     "box=1:"
                                     "boxcolor=0x00000000@1")

    export_mp4(concat_file, filter_string, export_directory)
    export_ogv(concat_file, filter_string, export_directory)
    export_webm(concat_file, filter_string, export_directory)
    export_gif(concat_file, filter_string, export_directory)
    export_png_sequence(image_directory, export_directory)
    export_svg_sequence(image_directory, export_directory)


def export_mp4(concat_file, filter_string, export_directory):
    meta.write({"processing": "Exporting MP4"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.mp4")

    subprocess.run([
        library["ffmpeg"],
        "-y",
        "-f", "concat",
        "-i", concat_file,
        "-filter_complex", filter_string,
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "4",
        export_file
    ])

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


def export_ogv(concat_file, filter_string, export_directory):
    meta.write({"processing": "Exporting OGV"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.ogv")

    subprocess.run([
        library["ffmpeg"],
        "-y",
        "-f", "concat",
        "-i", concat_file,
        "-filter_complex", filter_string,
        "-c:v", "libtheora",
        "-qscale:v", "10",
        export_file
    ])

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


def export_webm(concat_file, filter_string, export_directory):
    meta.write({"processing": "Exporting WEBM"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.webm")

    subprocess.run([
        library["ffmpeg"],
        "-y",
        "-f", "concat",
        "-i", concat_file,
        "-filter_complex", filter_string,
        "-c:v", "libvpx-vp9",
        "-crf", "4",
        "-speed", "1",
        "-b:v", "32M",
        export_file
    ])

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


def export_gif(concat_file, filter_string, export_directory):
    """Export a GIF from the input frames, scaled down to 720p"""

    meta.write({"processing": "Exporting GIF"})
    benchmark = time()

    # GIF encoding technique taken from
    # http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html

    # TODO: Should we force-scale GIF for any reason (decision)
    # filter_string += ", scale=720:-1:flags=lanczos"

    palette_file = path.join(export_directory, "palette.png")
    subprocess.run([
        library["ffmpeg"],
        "-y",
        "-f", "concat",
        "-i", concat_file,
        "-filter_complex", filter_string + ", palettegen",
        palette_file
    ])

    export_file = path.join(export_directory, "exported.gif")
    subprocess.run([
        library["ffmpeg"],
        "-y",
        "-f", "concat",
        "-i", concat_file,
        "-i", palette_file,
        "-filter_complex", filter_string + " [comp]; [comp][1:v] paletteuse",
        export_file
    ])

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


def export():
    if bpy.context.scene.frame_end > bpy.context.scene.frame_start:
        export_animation()
    else:
        export_still()
