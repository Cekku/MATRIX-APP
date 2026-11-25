@echo off
rem Crea l'APK firmato della Matrix con i file attuali del sito.
rem Serve: Java 21 (percorso scritto in ..\..\MATRIX-CHIAVE-ANDROID\java.txt, oppure JAVA_HOME),
rem Android SDK di Android Studio, chiave in ..\..\MATRIX-CHIAVE-ANDROID
cd /d "%~dp0"
set "CHIAVE=%~dp0..\..\MATRIX-CHIAVE-ANDROID"
if exist "%CHIAVE%\java.txt" set /p JAVA_HOME=<"%CHIAVE%\java.txt"
if not defined JAVA_HOME ( echo Manca Java 21: scrivi il percorso in MATRIX-CHIAVE-ANDROID\java.txt & pause & exit /b 1 )
if not exist "%CHIAVE%\chiave.properties" ( echo Manca la chiave di firma in MATRIX-CHIAVE-ANDROID & pause & exit /b 1 )
if not exist node_modules call npm install --no-audit --no-fund || ( pause & exit /b 1 )
call npm run sync || ( pause & exit /b 1 )
cd android
call .\gradlew.bat assembleRelease --console=plain || ( pause & exit /b 1 )
copy /y "app\build\outputs\apk\release\app-release.apk" "%~dp0..\..\Matrix.apk" >nul
echo.
echo APK pronto: Desktop\Matrix.apk
pause
