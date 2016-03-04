import json

from flask import Flask, jsonify, render_template, redirect, request, send_file, url_for
from glob import glob
from natsort import natsorted
from os import path, remove
from slugify import slugify
from subprocess import call
from time import strftime

from configuration import BLENDER_PATH

GENERATE_SCRIPT = path.join(path.dirname(__file__), "generator-blender.py")
UPDATE_SCRIPT = path.join(path.dirname(__file__), "updater-blender.py")

MIMETYPES = {
    "png": "image/png",
    "jpg": "image/jpg",
    "svg": "image/svg",
    "gif": "image/gif",
    "mp4": "video/mp4",
    "ogv": "video/ogg",
    "webm": "video/webm",
    "svg.zip": "application/zip",
    "png.zip": "application/zip"
}


app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/new")
def new():
    return render_template("new.html")


@app.route("/generate", methods=["POST"])
def generate():
    blender_call = [
        BLENDER_PATH,
        "--background",
        "--python",
        GENERATE_SCRIPT,
        "--"
    ]

    for key, value in request.form.items():
        blender_call.append("--{0}".format(key))
        blender_call.append(value)

    blender_call.append("--id")
    blender_call.append(slugify(request.form["title"]))

    call(blender_call)

    return redirect(url_for("index"))


@app.route("/visualizations")
def visualizations():
    visualizations_export = []

    for viz in sorted(glob("visualizations/*")):
        title = path.basename(viz)
        versions = natsorted(glob(path.join(viz, "*")), reverse=True)

        versions_export = []

        for version in versions:
            meta = {
                "title": title,
                "version": path.basename(version)
            }

            meta_path = path.join(version, "meta.json")

            if path.exists(meta_path):
                with open(meta_path) as file:
                    meta.update(json.loads(file.read()))

            versions_export.append(meta)

        visualizations_export.append({"versions": versions_export})

    return jsonify({"visualizations": visualizations_export})


@app.route("/vis/<visualization>/upload", methods=["POST"])
def upload(visualization):
    blender_call = [
        BLENDER_PATH,
        "--background",
        "--python",
        UPDATE_SCRIPT,
        "--"
    ]

    blender_call.append("--id")
    blender_call.append(visualization)

    filename = path.join("visualizations",
                         visualization,
                         ".{0}.blend".format(strftime("%Y%m%dT%H%M%S")))
    file = request.files["blendfile"]
    file.save(filename)

    blender_call.append("--blend")
    blender_call.append(filename)

    call(blender_call)

    remove(filename)

    return jsonify({"success": True}), 200, {'ContentType':'application/json'}


@app.route("/vis/<visualization>/update", methods=["POST"])
def update(visualization):
    blender_call = [
        BLENDER_PATH,
        "--background",
        "--python",
        UPDATE_SCRIPT,
        "--"
    ]

    blender_call.append("--id")
    blender_call.append(visualization)

    call(blender_call)

    return jsonify({"success": True}), 200, {'ContentType':'application/json'}


@app.route("/vis/<visualization>/<version>")
def embedded(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        version = path.basename(versions[-1])

    meta_path = path.join(visualization_path, version, "meta.json")

    with open(meta_path) as file:
        meta = json.loads(file.read())

    if meta["mediaType"] == 'still':
        file = path.join(visualization_path, version, "exported.png")

        if path.exists(file):
            return send_file(file, mimetype="image/png")

    elif meta["mediaType"] == 'animation':
        file = path.join(visualization_path, version, "exported.mp4")

        if path.exists(file):
            return send_file(file, mimetype="video/mp4")


@app.route("/vis/<visualization>/<version>/blend")
def download_blend(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        version = path.basename(versions[-1])

    blend_file = path.join(visualization_path, version, "scene.blend")

    return send_file(blend_file,
                     mimetype="application/x-blender",
                     as_attachment=True,
                     attachment_filename="{0}.blend".format(visualization))


@app.route("/vis/<visualization>/<version>/<format>")
def download(visualization, version, format):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = glob(path.join(visualization_path, "*"))
        version = path.basename(natsorted(versions)[-1])

    if format == 'thumbnail':
        gif_file = path.join(visualization_path, version, "thumbnail.gif")
        png_file = path.join(visualization_path, version, "thumbnail.png")

        if path.exists(gif_file):
            return send_file(gif_file, mimetype="image/gif")
        elif path.exists(png_file):
            return send_file(png_file, mimetype="image/png")
    else:
        file = path.join(visualization_path,
                         version,
                         "exported.{}".format(format))

        if path.exists(file):
            return send_file(file,
                             mimetype=MIMETYPES[format],
                             as_attachment=True,
                             attachment_filename="{0}.{1}".format(visualization,
                                                                  format))


if __name__ == "__main__":
    app.run(debug=True)
