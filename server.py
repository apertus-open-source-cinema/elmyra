import json

from flask import Flask, jsonify, render_template, redirect, request, send_file, url_for
from glob import glob
from natsort import natsorted
from os import path
from slugify import slugify
from subprocess import call

GENERATE_SCRIPT = path.join(path.dirname(__file__), "generator-blender.py")
UPDATE_SCRIPT = path.join(path.dirname(__file__), "updater-blender.py")

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
        "blender",
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


@app.route("/<visualization>/upload", methods=["POST"])
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

    # TODO: Unique temporary name
    filename = path.join("/tmp", "scene.blend")
    file = request.files["blendfile"]
    # TODO: Platform-independent temporary storage (?)
    file.save(filename)

    blender_call.append("--blend")
    blender_call.append(filename)

    call(blender_call)

    return jsonify({"success": True}), 200, {'ContentType':'application/json'}


@app.route("/<visualization>/update", methods=["POST"])
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


@app.route("/visualizations")
def visualizations():
    visualizations_export = []

    for viz in sorted(glob("visualizations/*")):
        title = path.basename(viz)
        versions = natsorted(glob(path.join(viz, "*")), reverse=True)
        latest_version = versions[-1]

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


@app.route("/<visualization>/<version>/png")
def png(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        file = path.join(versions[-1], "still.png")
    else:
        file = path.join(visualization_path, version, "still.png")

    if path.exists(file):
        return send_file(file,
                         mimetype="image/png",
                         as_attachment=True,
                         attachment_filename="{}.png".format(visualization))


@app.route("/<visualization>/<version>/jpg")
def jpg(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        file = path.join(versions[-1], "still.jpg")
    else:
        file = path.join(visualization_path, version, "still.jpg")

    if path.exists(file):
        return send_file(file,
                         mimetype="image/jpg",
                         as_attachment=True,
                         attachment_filename="{}.jpg".format(visualization))


@app.route("/<visualization>/<version>/mp4")
def mp4(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        file = path.join(versions[-1], "animation.mp4")
    else:
        file = path.join(visualization_path, version, "animation.mp4")

    if path.exists(file):
        return send_file(file,
                         mimetype="video/mp4",
                         as_attachment=True,
                         attachment_filename="{}.mp4".format(visualization))


@app.route("/<visualization>/<version>/ogv")
def ogv(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        file = path.join(versions[-1], "animation.ogv")
    else:
        file = path.join(visualization_path, version, "animation.ogv")

    if path.exists(file):
        return send_file(file,
                         mimetype="video/ogg",
                         as_attachment=True,
                         attachment_filename="{}.ogv".format(visualization))


@app.route("/<visualization>/<version>/webm")
def webm(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        file = path.join(versions[-1], "animation.webm")
    else:
        file = path.join(visualization_path, version, "animation.webm")

    if path.exists(file):
        return send_file(file,
                         mimetype="video/webm",
                         as_attachment=True,
                         attachment_filename="{}.webm".format(visualization))


@app.route("/<visualization>/<version>/gif")
def gif(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        file = path.join(versions[-1], "animation.gif")
    else:
        file = path.join(visualization_path, version, "animation.gif")

    if path.exists(file):
        return send_file(file,
                         mimetype="image/gif",
                         as_attachment=True,
                         attachment_filename="{}.gif".format(visualization))


@app.route("/<visualization>/<version>/zip")
def zip(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        file = path.join(versions[-1], "animation.zip")
    else:
        file = path.join(visualization_path, version, "animation.zip")

    if path.exists(file):
        return send_file(file,
                         mimetype="application/zip",
                         as_attachment=True,
                         attachment_filename="{}.zip".format(visualization))


@app.route("/<visualization>/<version>/thumbnail")
def thumbnail(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        version_path = path.join(versions[-1])
    else:
        version_path = path.join(visualization_path, version)

    gif_file = path.join(version_path, "thumbnail.gif")
    png_file = path.join(version_path, "thumbnail.png")

    if path.exists(gif_file):
        return send_file(gif_file, mimetype="image/gif")
    elif path.exists(png_file):
        return send_file(png_file, mimetype="image/png")


@app.route("/<visualization>/<version>/blend")
def download_blend(visualization, version):
    visualization_path = path.join("visualizations", visualization)

    if version == "latest":
        versions = natsorted(glob(path.join(visualization_path, "*")))
        blend_file = path.join(versions[-1], "scene.blend")
    else:
        blend_file = path.join(visualization_path, version, "scene.blend")

    return send_file(blend_file,
                     mimetype="application/x-blender",
                     as_attachment=True,
                     attachment_filename="{0}.blend".format(visualization))


@app.route("/static/<path:path>")
def serve_asset(path):
    return send_file(path.join("static", path))


if __name__ == "__main__":
    app.run(debug=True)
