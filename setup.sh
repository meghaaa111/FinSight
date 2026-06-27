#!/bin/bash

echo "🚀 Setting up FinSight Financial Intelligence Platform"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your OPENAI_API_KEY before continuing"
    echo ""
    exit 1
else
    echo "✅ .env file found"
fi

# Check if OPENAI_API_KEY is set
if grep -q "your_openai_api_key_here" .env; then
    echo "⚠️  Please edit .env and add your OPENAI_API_KEY"
    exit 1
fi

echo "🐳 Starting Docker containers..."
docker-compose up --build -d

echo ""
echo "✅ FinSight is starting up!"
echo ""
echo "📍 Access points:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "⏳ Waiting for services to be ready (this may take a minute)..."
sleep 10

echo ""
echo "📊 Container status:"
docker-compose ps

echo ""
echo "🎉 Setup complete! Visit http://localhost:3000 to get started"
echo ""
echo "💡 Useful commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop:         docker-compose down"
echo "   Restart:      docker-compose restart"
