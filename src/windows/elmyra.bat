@ECHO OFF

ECHO Elmyra is going live on localhost:5000 - You can stop it by pressing [Ctrl]+[C]

%~dp0lib/windows/blender-2.78a-windows64/2.78/python/bin/python.exe main.py %1
