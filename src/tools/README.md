# Terraforming-mars maintenance tools

Tool directory is for specific scripts for project maintenance.

Before use them build the project `npm run build`

... then run any of compilled scripts from build directory `node <path-to-the-toolname>.js`

For example check_locales.ts tool can be run like this: `node build/src/tools/check_locales.js`

It is possible to run these tools "directly" by using ts-node package

1. Install ts-node on your machine `npm install -g ts-node`
2. Run the script `ts-node src/tools/check_locales.ts`

## Check locales tool

Check locales tool compares localizations and shows missing translations.

How to run: `node build/src/tools/check_locales.js`

Result will be something like this:
```
Effect: When you play an animal or plant tag, including<br> this, add 1 animal<br> to this card.
    missing ru
You start with 3 MC production and 44 MC.
    missing ru
    missing cn
...
```

If you want to see warnings for given locale only use --locales switch

`node build/src/tools/check_locales.js --locales cn,ru`

as result you will see the warnings for Chinese and Russian languages only.

## Export game

### Usage

`node build/src/tools/export_game.js <game id>`

### Description
This tool extracts the entire history of a game from a database and stores it in the local filesystem database.

If you plan to extract from the local SQLite database, have no environemnt variables. If you're extracting
from PostgreSQL, use the POSTGRES_HOST environment variable. You cannot export from a local filesystem database.
You might as well then just run `cp -R`
