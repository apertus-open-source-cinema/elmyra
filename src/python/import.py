'''
Imports from a URL and saves a new temp file for import

Custom arguments:
id -- the import scene identifier
url -- the url to the import file
'''

import sys

from argparse import ArgumentParser
from os import chdir, path

# Make this script's directory the current working directory (could be anything else)
# and add it to sys.path (this script runs from blender context)
elmyra_root = path.dirname(path.realpath(__file__))
chdir(elmyra_root)
sys.path.append(elmyra_root)

from lib import common, update


def parse_custom_args():
    parser = ArgumentParser(prog='Elmyra Import Params')

    parser.add_argument('--import-id', required=True)
    parser.add_argument('--url', required=True)
    parser.add_argument('--format', required=True)

    custom_args = sys.argv[sys.argv.index('--') + 1:]

    return parser.parse_args(custom_args)

args = parse_custom_args()

common.empty_scene()
update.import_model(args)
