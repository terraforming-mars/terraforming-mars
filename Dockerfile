FROM node:16-alpine3.15

EXPOSE 8080

LABEL maintainer="bafolts" \
      name="terraforming-mars" \
      Version="1.0"

WORKDIR /usr/src/app
COPY . .

RUN mkdir -p /usr/src/app/db \
  && apk add --no-cache --virtual .gyp git python3 make g++ \
  && ln -sf python3 /usr/bin/python \
  && npm install \
  && npm run build \
  && apk del --no-cache .gyp \
  && rm /usr/bin/python \
  && rm -rf .git \
  && rm -rf /tmp/* \
  && rm -rf /root/.cache \
  && rm -rf /root/.npm \
  && adduser -S -D -h /usr/src/app tfm \
  && chown -R tfm:nogroup .

USER tfm

CMD [ "npm", "run", "start" ]
