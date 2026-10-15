FROM node:22-bullseye-slim

# Install system dependencies: ffmpeg, python3, curl
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install latest yt-dlp binary for Linux
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Setup user 1000 for Hugging Face Spaces compatibility
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Copy package manifests and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application files
COPY server/ ./server/

# Ensure temp directory exists and permissions are granted
RUN mkdir -p /app/server/temp && chown -R user:user /app

USER user

# Set environment (Hugging Face Spaces expects port 7860)
ENV NODE_ENV=production
ENV PORT=7860

EXPOSE 7860

CMD ["node", "server/server.js"]

