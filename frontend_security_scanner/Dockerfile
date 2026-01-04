FROM node:22-bullseye

# 1️⃣ Dependencias del sistema (CRÍTICO)
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
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libgtk-3-0 \
  ca-certificates \
  fonts-liberation \
  wget \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2️⃣ Instalar dependencias Node
COPY package*.json ./
RUN npm ci

# 3️⃣ 🔥 INSTALAR CHROMIUM DE PLAYWRIGHT 🔥
RUN npx playwright install chromium

# 4️⃣ Copiar el resto del código
COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
