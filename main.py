"""Elmyra's python main entry point - the server and render manager"""

from multiprocessing import Process
from os import path
from subprocess import Popen, PIPE

import signal
import sys

import library
import server


RENDERER_SCRIPT = path.join(path.dirname(__file__), 'blender_renderer.py')


def start_server():
    debug = len(sys.argv) > 1 and sys.argv[1] == '--development'

    process = Process(name="server", target=server.run, args=(debug,))
    process.start()

    return process

def start_renderer():
    renderer_args = [
        library.BLENDER,
        "--background",
        "--python", RENDERER_SCRIPT,
        "--",
        "--device", "GPU",
        "--target_time", "60"
    ]

    return Popen(renderer_args)


if __name__ == '__main__':

    def terminate(signum, frame):
        renderer.terminate()
        renderer.wait()
        server.terminate()
        server.join()

        sys.exit(0)

    signal.signal(signal.SIGINT, terminate)
    signal.signal(signal.SIGTERM, terminate)

    renderer = start_renderer()
    server = start_server()
