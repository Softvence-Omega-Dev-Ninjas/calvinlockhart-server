# Use Node.js 24-slim image
FROM node:24-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y openssl

# Copy package files, data & prisma folder
COPY package*.json ./
COPY data ./data
COPY prisma ./prisma

# Install dependencies
RUN npm install 

# Copy rest of the project files
COPY . .

# Build the app (NestJS -> dist/)
RUN npm run build

# Expose the port
EXPOSE 5010

CMD ["npm", "run", "start:prod"]
