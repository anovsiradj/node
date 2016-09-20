@echo off
SET basepath=%~dp0

start %basepath%..\..\bin\nw\nw .

exit

:: untuk lihat basepath-nya
:: echo|set /p=%basepath%|clip
