# Dockerfile for React (Development)
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the development server port
EXPOSE 3000

# Start the React app with hot reload support
CMD ["npm", "start"]