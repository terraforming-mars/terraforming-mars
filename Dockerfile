FROM node:lts-alpine

WORKDIR /usr/src/app

RUN addgroup -S tfm

RUN adduser -S -D -h /usr/src/app tfm tfm

RUN chown -R tfm:tfm /usr/src/app

USER tfm

COPY package*.json ./

RUN npm install

EXPOSE 8080

COPY . .

CMD [ "npm", "run", "start" ]
