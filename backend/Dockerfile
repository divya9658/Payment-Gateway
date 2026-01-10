FROM node:18-alpine
WORKDIR /app
# Copy package files first to optimize building
COPY package*.json ./
RUN npm install
# Copy the rest of the code
COPY . .
EXPOSE 8000
# Use 'npm start' which calls 'node server.js' from your package.json
CMD ["npm", "start"]