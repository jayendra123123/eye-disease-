@echo off
echo 🚀 Starting DeepEye Application...
echo.

echo 📦 Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo 📦 Installing Frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Frontend dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🔧 Starting services...
echo.

echo 🖥️  Backend API will run on: http://localhost:8000
echo 🌐 Frontend will run on: http://localhost:3000
echo.

start "DeepEye API" cmd /k "cd .. && python app.py"
timeout /t 3 /nobreak > nul
start "DeepEye Frontend" cmd /k "npm start"

echo.
echo 🎉 DeepEye is starting up!
echo.
echo 📋 To use the application:
echo    1. Wait for both services to start
echo    2. Open http://localhost:3000 in your browser
echo    3. Upload an eye image for analysis
echo.
pause