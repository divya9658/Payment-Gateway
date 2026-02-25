FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# Add this line to skip interactive prompts
ENV CI=true 
# Add this to ensure it binds to the network
ENV HOST=0.0.0.0 
CMD ["npm", "start"]