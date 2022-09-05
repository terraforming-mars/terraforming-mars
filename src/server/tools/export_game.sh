#!/bin/sh

[ "$#" -eq 2 ] || die "parameters required: [app] [player id | spectator id | game id]"
APP=$1
ID=$2

# xargs trims the string
POSTGRES_HOST=$(heroku pg:credentials:url --app $1 | grep postgres: | xargs)

echo POSTGRES_HOST is ${POSTGRES_HOST}

POSTGRES_HOST=${POSTGRES_HOST} node build/src/server/tools/export_game.js $2
