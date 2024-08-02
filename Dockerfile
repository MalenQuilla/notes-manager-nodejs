FROM node:22.5-alpine
LABEL authors="malenquillaa"

WORKDIR /app

# Copy package.json and package-lock.json from the root context
COPY package*.json .

RUN npm install

# Copy the entire src directory from the root context
COPY --chown=node:node . .

USER node

# Copy the tsconfig.json from the root context
COPY tsconfig.json ./

# Compile TypeScript to JavaScript
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "start"]