@echo off
echo Setting up FinSight Financial Intelligence Platform
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo WARNING: Please edit .env and add your OPENAI_API_KEY before continuing
    echo.
    exit /b 1
) else (
    echo .env file found
)

REM Check if OPENAI_API_KEY is set
findstr /C:"your_openai_api_key_here" .env >nul
if %errorlevel% equ 0 (
    echo WARNING: Please edit .env and add your OPENAI_API_KEY
    exit /b 1
)

echo Starting Docker containers...
docker-compose up --build -d

echo.
echo FinSight is starting up!
echo.
echo Access points:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo.
echo Waiting for services to be ready (this may take a minute)...
timeout /t 10 /nobreak >nul

echo.
echo Container status:
docker-compose ps

echo.
echo Setup complete! Visit http://localhost:3000 to get started
echo.
echo Useful commands:
echo    View logs:    docker-compose logs -f
echo    Stop:         docker-compose down
echo    Restart:      docker-compose restart
