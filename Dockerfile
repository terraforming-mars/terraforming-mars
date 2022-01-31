# Intermediate image to build solution
FROM node:16.13.2-alpine3.15 AS builder

# Install required tools
RUN apk add --no-cache --virtual .gyp git python3 make g++ \
  && ln -sf python3 /usr/bin/python

WORKDIR /usr/src/app

# Install dependencies first, to cache the image.
COPY ["package.json", "package-lock.json", "./"]

# Set node environment to 'production'. Go with 'development' for local deployments.
# todo - not working yet # ENV NODE_ENV=production

RUN npm ci

# Building the app.
COPY . .

RUN npm run build 

# Target image
FROM node:16.13.2-alpine3.15

WORKDIR /usr/src/app

# Copy required files.

COPY ["package.json", "package-lock.json", "./"]

COPY assets ./assets

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/build ./build

# Add user tfm
RUN adduser -S -D -h /usr/src/app tfm \
  && chown -R tfm:nogroup .

USER tfm

# Run command.

EXPOSE 8080

CMD npm run start
