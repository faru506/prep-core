FROM node:20

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (skip optional deps → fixes rollup bug)
RUN npm install --omit=optional \
 && npm install rollup --save-dev

# Copy project files
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]