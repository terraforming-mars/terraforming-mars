FROM node:16.13.2-alpine3.15

# Prepare base image to cache.
RUN apk add --no-cache --virtual .gyp git python3 make g++ \
  && ln -sf python3 /usr/bin/python

WORKDIR /app

# Install dependencies first, to cache the image.
COPY ["package.json", "package-lock.json", "./"]

# Set node environment to 'production'. Go with 'development' for local deployments.
# todo - not working yet # ENV NODE_ENV=production

RUN npm install

# Building the app.
COPY . .

RUN npm run build 

# Pruning.
RUN npm prune \
  && apk del --no-cache .gyp \
  && rm /usr/bin/python \
  && rm -rf .git \
  && rm -rf /tmp/* \
  && rm -rf /root/.cache \
  && rm -rf /root/.npm 

# Add user tfm
RUN adduser -S -D -h /app tfm \
  && chown -R tfm:nogroup .

USER tfm

# Run command.

CMD [ "npm", "run", "start" ]
