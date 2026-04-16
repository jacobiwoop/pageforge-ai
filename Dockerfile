# STAGE 1: Build the React/Vite Frontend
FROM node:18 AS frontend-builder
WORKDIR /app

# Install frontend dependencies
COPY package.json ./
RUN npm install && npm rebuild @tailwindcss/oxide


# Build frontend
COPY . .
RUN npm run build

# STAGE 2: Backend + Node.js (OpenCode) + Final Image
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies (curl and git for OpenCode, build-essential for some pip packages)
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (required to run opencode-ai globally)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
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
