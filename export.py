import bpy

from datetime import datetime
from glob import glob
from os import path
from shutil import copy
from subprocess import call
from time import time
from zipfile import ZipFile

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
    export_svg(image_directory, export_directory)


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


def export_animation(options):
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
    export_png_sequence(image_directory, export_directory)
    export_svg_sequence(image_directory, export_directory)


def export_thumbnail_animation(ffmpeg_input_options, export_directory):
    meta.write({"processing": "Exporting Thumbnail"})
    benchmark = time()

    # TODO: Figure out if the scaling makes sense
    # (480 in old vs 320 in new? applies for palette and/or result?)
    #
    # old call for reference:
    # ffmpeg_call = ffmpeg_input_options + [
    #     "-vf", "scale=480:-1",
    #     "-gifflags", "+transdiff",
    #     export_file
    # ]

    export_file = path.join(export_directory, "thumbnail.gif")

    # GIF encoding technique taken from
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
        "-qscale:v", "7",
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
        "-b:v", "1M",
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

    meta.write({"processing": "Exporting GIF"})
    benchmark = time()

    export_file = path.join(export_directory, "exported.gif")

    # GIF encoding technique taken from
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


def export(options):
    if bpy.context.scene.frame_end > bpy.context.scene.frame_start:
        export_animation(options)
    else:
        export_still(options)
