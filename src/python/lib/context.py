from os import environ, path

DATA_DIR = environ['ELMYRA_DATA_DIR']
FFMPEG_EXECUTABLE = environ['ELMYRA_FFMPEG_EXECUTABLE']
RUNTIME_DIR = environ['ELMYRA_RUNTIME_DIR']

IMPORTS_DIR = path.join(DATA_DIR, 'imports')
LIBRARY_DIR = path.join(RUNTIME_DIR, 'lib/elmyra')
UPLOAD_DIR = path.join(DATA_DIR, 'upload')
VISUALIZATIONS_DIR = path.join(DATA_DIR, 'visualizations')
