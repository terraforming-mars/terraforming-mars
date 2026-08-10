import '@/server/init';
import fs from 'fs';
import path from 'path';
import {buildCardDatabase, buildIndex} from './cardDatabase/buildCardDatabase';
import {globalInitialize} from '@/server/globalInitialize';

const OUTPUT_DIRECTORY = 'data/cards';

globalInitialize();

const cards = buildCardDatabase();
const index = buildIndex(cards);

fs.mkdirSync(OUTPUT_DIRECTORY, {recursive: true});
fs.writeFileSync(path.join(OUTPUT_DIRECTORY, 'cards.json'), JSON.stringify(cards, undefined, 2) + '\n');
fs.writeFileSync(path.join(OUTPUT_DIRECTORY, 'index.json'), JSON.stringify(index, undefined, 2) + '\n');

const bespoke = cards.filter((card) => card.bespoke).length;
console.log(`Wrote ${cards.length} cards to ${OUTPUT_DIRECTORY}/cards.json (${bespoke} with hand-written semantics).`);
