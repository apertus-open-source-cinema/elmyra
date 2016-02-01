import bpy

from datetime import datetime
from os import path
from subprocess import call, check_output
from time import time

from configuration import FFMPEG_PATH

import meta


def export_still(options):
    export_directory = bpy.path.abspath("//")
    image_directory = path.join(export_directory, "rendered_frames")

    ffmpeg_input_options = [
        FFMPEG_PATH,
        '-y',
        "-f", "image2",
        "-pattern_type", "glob",
        "-framerate", "24",
        "-i", path.join(image_directory, "*.png")
    ]

    export_thumbnail_still(ffmpeg_input_options, export_directory)
    export_png(ffmpeg_input_options, export_directory)
    export_jpg(ffmpeg_input_options, export_directory)


def export_thumbnail_still(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting Thumbnail"})
    benchmark = time()

    export_file = path.join(export_directory, "thumbnail.png")
    ffmpeg_call = ffmpeg_input_options + [
        "-vf", "scale=480:-1",
        export_file
    ]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "thumbnail": {
            "filePath": "thumbnail.png",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_jpg(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting JPG"})
    benchmark = time()

    export_file = path.join(export_directory, "still.jpg")
    ffmpeg_call = ffmpeg_input_options + [export_file]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "jpg": {
            "filePath": "still.jpg",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_png(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting PNG"})
    benchmark = time()

    export_file = path.join(export_directory, "still.png")
    ffmpeg_call = ffmpeg_input_options + [export_file]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "png": {
            "filePath": "still.png",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_animation(options):

    # TODO: Properly model separation between thumbnail and final exporting ?

    export_directory = bpy.path.abspath("//")
    image_directory = path.join(export_directory, "rendered_frames")

    ffmpeg_input_options = [
        FFMPEG_PATH,
        "-y",
        "-f", "image2",
        "-pattern_type", "glob",
        "-framerate", "24",
        "-i", path.join(image_directory, "*.png")
    ]

    export_thumbnail_animation(ffmpeg_input_options, export_directory)
    export_mp4(ffmpeg_input_options, export_directory)
    export_ogv(ffmpeg_input_options, export_directory)
    export_webm(ffmpeg_input_options, export_directory)
    export_gif(ffmpeg_input_options, export_directory)
    export_zip(image_directory, export_directory)


def export_thumbnail_animation(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting Thumbnail"})
    benchmark = time()

    # TODO: Use better algorithm if available like in export_gif

    export_file = path.join(export_directory, "thumbnail.gif")
    ffmpeg_call = ffmpeg_input_options + [
        "-vf", "scale=480:-1",
        "-gifflags", "+transdiff",
        export_file
    ]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "thumbnail": {
            "filePath": "thumbnail.gif",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_mp4(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting MP4"})
    benchmark = time()

    export_file = path.join(export_directory, "animation.mp4")
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
            "filePath": "animation.mp4",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_ogv(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting OGV"})
    benchmark = time()

    export_file = path.join(export_directory, "animation.ogv")
    ffmpeg_call = ffmpeg_input_options + [
        "-codec:v", "libtheora",
        "-qscale:v", "7",
        export_file
    ]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "ogv": {
            "filePath": "animation.ogv",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_webm(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting WEBM"})
    benchmark = time()

    export_file = path.join(export_directory, "animation.webm")
    ffmpeg_call = ffmpeg_input_options + [
        "-c:v", "libvpx",
        "-crf", "4",
        "-b:v", "1M",
        export_file
    ]

    call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "webm": {
            "filePath": "animation.webm",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_gif(ffmpeg_input_options, export_directory):

    meta.write({"processing": "Exporting GIF"})
    benchmark = time()

    ffmpeg_version = check_output([FFMPEG_PATH, "-version"]).decode().split()[2]
    ffmpeg_version_major = int(ffmpeg_version.split(".")[0])
    ffmpeg_version_minor = int(ffmpeg_version.split(".")[1])

    export_file = path.join(export_directory, "animation.gif")

    if ffmpeg_version_major >= 2 and ffmpeg_version_minor >= 6:

        # Only available in ffmpeg 2.6+ (eg. in Ubuntu 15.10, Fedora 22)
        # http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html

        palette_file = path.join(export_directory, "palette.png")
        filters = "fps=15,scale=320:-1:flags=lanczos"

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
    else:
        ffmpeg_call = ffmpeg_input_options + [
            "-gifflags", "+transdiff",
            export_file
        ]

        call(ffmpeg_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "gif": {
            "filePath": "animation.gif",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export_zip(image_directory, export_directory):
    meta.write({"processing": "Exporting ZIP"})
    benchmark = time()

    export_file = path.join(export_directory, "animation.zip")
    zip_call = [
        "zip",
        "-r9",
        export_file,
        path.join(image_directory, "")
    ]

    call(zip_call)

    filesize = path.getsize(export_file)
    meta.write({
        "processing": False,
        "zip": {
            "filePath": "animation.zip",
            "exported": datetime.now().isoformat(),
            "processingTime": time() - benchmark,
            "fileSize": filesize
        }
    })


def export(options):
    if bpy.context.scene.frame_end > bpy.context.scene.frame_start:
        export_animation(options)
    else:
        export_still(options)
