@ECHO OFF

SETLOCAL
SET BLENDER_BIN_DIR="lib/windows/blender-2.77a-windows64"
SET FFMPEG_BIN_DIR="lib/windows/ffmpeg-20160425-git-9ac154d-win64-static/bin"

SET PATH=%BLENDER_BIN_DIR%;%FFMPEG_BIN_DIR%;%PATH%

ECHO Elmyra Server at localhost:5000 will start in 3 seconds - You can stop it by pressing [Ctrl]+[C]

timeout /t 3 /nobreak > NUL

%~dp0lib/windows/blender-2.77a-windows64/2.77/python/bin/python.exe server.py
