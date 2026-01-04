FROM node:22-bullseye

# Instalar dependencias necesarias para Chromium
RUN apt-get update && apt-get install -y \
  libglib2.0-0 \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libasound2 \
  libxshmfence1 \
  libx11-xcb1 \
  ca-certificates \
  fonts-liberation \
  wget \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npx playwright install chromium

COPY . .

EXPOSE 8080
CMD ["npm", "start"]