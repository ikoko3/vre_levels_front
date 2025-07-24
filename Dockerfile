FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=development
ENV NODE_OPTIONS=--inspect=0.0.0.0:9229
EXPOSE 4000 9229
CMD ["npm", "run", "dev"]
