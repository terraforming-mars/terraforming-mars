FROM node:lts-alpine

EXPOSE 8080

LABEL maintainer="bafolts" \
      name="terraforming-mars" \
      Version="1.0"

RUN mkdir -p /usr/src/app/db \
   && addgroup -S tfm \
   && adduser -S -D -h /usr/src/app tfm tfm \
   && apk add --no-cache --virtual .gyp git python make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY --chown=tfm:tfm . .

RUN npm run build  \
   && rm -rf .git \
   && apk del git .gyp

USER tfm

CMD [ "npm", "run", "start" ]
