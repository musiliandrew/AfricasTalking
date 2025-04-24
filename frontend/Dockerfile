# frontend/Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Install deps and copy files
COPY frontend/package.json frontend/package-lock.json* ./ 
RUN npm install

COPY frontend/ .

# Expose and start dev server
EXPOSE 5173
CMD ["npm", "run", "dev"]
