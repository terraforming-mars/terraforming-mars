require('dotenv').config();
import * as fs from 'fs';

import {ALL_CARD_MANIFESTS} from '../cards/AllCards';
import {CardManifest} from '../cards/CardManifest';
import {ICard} from '../cards/ICard';
import {Deck} from '../Deck';
import {GameModule} from '../GameModule';

const json: Array<any> = [];

console.log('Starting');
ALL_CARD_MANIFESTS.forEach(processManifest);
console.log('Done');

function processManifest(manifest: CardManifest) {
  processDeck(manifest.module, manifest.projectCards);
  processDeck(manifest.module, manifest.corporationCards);
  processDeck(manifest.module, manifest.preludeCards);
  processDeck(manifest.module, manifest.standardActions);
  processDeck(manifest.module, manifest.standardProjects);
}

function processDeck(module: GameModule, deck: Deck<ICard>) {
  deck.factories.forEach((factory) => {
    processCard(module, new factory.Factory());
  });
}

function processCard(module: GameModule, card: ICard) {
  const vizCardData = {
    module: module,
    name: card.name,
    tags: card.tags,
    cardDiscount: card.cardDiscount,
    resourceType: card.resourceType,
    cost: card.cost,
    cardType: card.cardType,
    requirements: card.requirements,
    metadata: card.metadata,
    warning: card.warning,
  };

  json.push(vizCardData);
}

if (!fs.existsSync('src/genfiles')) {
  fs.mkdirSync('src/genfiles');
}

fs.writeFileSync('src/genfiles/cards.json', JSON.stringify(json, null, 2));
