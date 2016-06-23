import json
import sys
import uuid

from flask import Flask, jsonify, render_template, redirect, request, send_file, url_for
from glob import glob
from natsort import natsorted
from os import path, remove
from subprocess import call
from time import strftime

GENERATE_SCRIPT = path.join(path.dirname(__file__), "blender_generate.py")
IMPORT_SCRIPT = path.join(path.dirname(__file__), "blender_import.py")
UPDATE_SCRIPT = path.join(path.dirname(__file__), "blender_update.py")

MIMETYPES = {
    "png": "image/png",
    "jpg": "image/jpg",
    "svg": "image/svg",
    "gif": "image/gif",
    "mp4": "video/mp4",
    "ogv": "video/ogg",
    "webm": "video/webm",
    "svg.zip": "application/zip",
    "png.zip": "application/zip",
    "html": "text/html"
}


app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/import", methods=["POST"])
def import_model():
    url = request.form["url"]
    id = "{0}-{1}".format(strftime("%Y%m%d"), str(uuid.uuid4()))

    blender_call = [
        "blender",
        "--background",
        "--python",
        IMPORT_SCRIPT,
        "--",
        "--url", url,
        "--id", id
    ]

    call(blender_call)

    if path.exists(path.join('imports', id)):
        return jsonify({ "importID": id })
    else:
        return "", 400


@app.route("/import/<id>")
def import_preview(id):
    import_preview_obj = path.join("imports", id, "preview.obj")

    return send_file(import_preview_obj,
                     mimetype="text/plain",
                     as_attachment=True,
                     attachment_filename="preview.obj")

@app.route("/generate", methods=["POST"])
def generate():
    blender_call = [
        "blender",
        "--background",
        "--python",
        GENERATE_SCRIPT,
        "--"
    ]

    for key, value in request.form.items():
        blender_call.append("--{0}".format(key))
        blender_call.append(value)

    call(blender_call)

    return jsonify({ "done": "true" })


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
        "blender",
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
        "blender",
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

    if meta["mediaType"] == "still":
        file = path.join(visualization_path, version, "exported.png")

        if path.exists(file):
            return send_file(file, mimetype="image/png")

    elif meta["mediaType"] == "animation":
        file = path.join(visualization_path, version, "exported.webm")

        if path.exists(file):
            return send_file(file, mimetype="video/webm")

    elif meta["mediaType"] == "web3d":
        file = path.join(visualization_path, version, "exported.html")

        if path.exists(file):
            return send_file(file, mimetype="text/html")

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
        thumb_filepath = path.join(visualization_path, version, "thumbnail.png")

        if path.exists(thumb_filepath):
            return send_file(thumb_filepath, mimetype="image/png")
        else:
            return "", 404
    else:
        exported_file = path.join(visualization_path,
                                  version,
                                  "exported.{}".format(format))

        if path.exists(exported_file):
            return send_file(exported_file,
                             mimetype=MIMETYPES[format],
                             as_attachment=True,
                             attachment_filename="{0}.{1}".format(visualization,
                                                                  format))
        else:
            return "", 404


if __name__ == "__main__":
    debug = False

    if len(sys.argv) > 1 and sys.argv[1] == '--development':
        debug = True

    app.run(debug=debug, threaded=True)
