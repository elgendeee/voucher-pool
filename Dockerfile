FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

# Build TypeScript
# RUN npm run build

EXPOSE 3000

# Start the app using nodemon in development
CMD [ "npm", "run", "dev" ]
