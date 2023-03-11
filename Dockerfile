FROM node:15-buster

EXPOSE 80

WORKDIR /th-api

COPY . .

RUN npm install && mkdir /files

CMD ["node", "index.js"]