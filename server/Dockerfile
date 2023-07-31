FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY ./ ./
RUN npm run build
EXPOSE 4000
CMD [ "npm", "start" ]