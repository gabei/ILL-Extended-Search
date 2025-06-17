# Use latest verson of node
FROM node:lts-alpine

# Set the container's working directory
WORKDIR /app

# Copy app's source to container
COPY . .

# Run build command
RUN npm run build

# Run application
CMD ["node", "src/index.js"]

# Expose this port for connection
EXPOSE 8000