# Terraforming-mars maintenance tools

Tool directory is for specific scripts for project maintenance.

Before use them build the project `npm run build`

... then run any of compiled scripts from build directory `node <path-to-the-toolname>.js`

For example check_locales.ts tool can be run like this: `node build/src/server/tools/check_locales.js`

It is possible to run these tools "directly" by using ts-node package

1. Install ts-node on your machine `npm install -g ts-node`
2. Run the script `ts-node src/server/tools/check_locales.ts`

## Check locales tool

#### Check locales tool compares localizations and shows missing translations.

How to run: `npm run make:json && npx tsx src/server/tools/check_locales.ts`

Result will be something like this:
```
"Select a Mars First bonus.": "es,nl,ru"
"Gain 1 M€ for each building tag you have": "es,nl,ru"
...
```
The languages in quotes are missing that translation. (In this case, Spanish, Dutch, and Russian are missing the translation.)


#### If you want to see warnings for given locale only use --locales switch

`npx tsx src/server/tools/check_locales.ts --locales cn,ru`

as result you will see the warnings for Chinese and Russian languages only.

## Export game

### Usage

```
npm run build
sh src/server/tools/export_game.sh <heroku-app-name>  <game id | player id | spectator id>
```

or

```
heroku pg:credentials:url --app <heroku-app-name>
POSTGRES_HOST=<postgres:...> node build/src/tools/export_game.js <game id | player id | spectator id>
```

### Description
This tool extracts the entire history of a game from a database and stores it in the local filesystem database.

If you plan to extract from the local SQLite database, have no environment variables. If you're extracting
from PostgreSQL, use the `POSTGRES_HOST` environment variable. You cannot export from a local filesystem database.
You might as well then just run `cp -R`

(Read https://github.com/terraforming-mars/terraforming-mars/wiki/Databases#maintenance
to get advice on setting up your `POSTGRES_HOST` environment variable.)

## Analyze MA

Starts a local web server that you can use to get results of MA synergy. To run,

```sh
npx tsx src/server/tools/analyze_ma.ts
```

And then point your browser to http://localhost:8081

Warning: this is a fragile tool, and it might fail or hide errors.

## MA stress test

Draws milestones and awards many times with random game options (board, modular MAs, fan MAs, and
each expansion that affects MAs), and reports how often the draw breaks: overall, by option, and for
the settings that broke most.

```sh
npx tsx src/server/tools/ma_stress.ts --runs 500
```

`--runs` counts thousands of draws, so `--runs 500` draws 500,000 regular games and then 500,000
modular games (default 100).
`--type unlimited` stress-tests full random instead of limited synergy.
