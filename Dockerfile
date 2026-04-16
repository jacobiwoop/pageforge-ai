# STAGE 1: Build the React/Vite Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app

# Install system deps needed for native bindings (tailwindcss/oxide)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install frontend dependencies (skip package-lock.json to avoid binding mismatches)
COPY package.json ./
RUN npm install

# Build frontend
COPY . .
RUN npm run build

# STAGE 2: Backend + Node.js (OpenCode) + Final Image
FROM python:3.12-slim
WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20 (required for OpenCode)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g opencode-ai

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY ui-agent/ui-rag ./ui-agent/ui-rag

# Copy compiled frontend from Stage 1 into the backend folder
# We place it in 'dist' so FastAPI can serve it
COPY --from=frontend-builder /app/dist ./ui-agent/ui-rag/dist

# Expose Render Port
EXPOSE 8000

ENV PORT=8000
ENV HOST=0.0.0.0

# Start the unified server
WORKDIR /app/ui-agent/ui-rag
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
