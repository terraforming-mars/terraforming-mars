require('dotenv').config();
import * as fs from 'fs';

import {ALL_CARD_MANIFESTS} from '../cards/AllCards';
import {CardManifest} from '../cards/CardManifest';
import {ICard} from '../cards/ICard';
import {Deck} from '../Deck';
import {GameModule} from '../common/cards/GameModule';
import {IClientCard} from '../common/cards/IClientCard';
import {CardType} from '../common/cards/CardType';
import {ICorporationCard} from '../cards/corporation/ICorporationCard';
import {PreludeCard} from '../cards/prelude/PreludeCard';

const json: Array<any> = [];

ALL_CARD_MANIFESTS.forEach(processManifest);

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
  let startingMegaCredits = undefined;
  let cardCost = undefined;
  if (card.cardType === CardType.PRELUDE) {
    startingMegaCredits = (card as PreludeCard).startingMegaCredits;
  }
  if (card.cardType === CardType.CORPORATION) {
    startingMegaCredits = (card as ICorporationCard).startingMegaCredits;
    cardCost = (card as ICorporationCard).cardCost;
  }
  const clientCard: IClientCard = {
    module: module,
    name: card.name,
    tags: card.tags,
    cardDiscount: card.cardDiscount,
    victoryPoints: card.victoryPoints,
    cost: card.cost,
    cardType: card.cardType,
    requirements: card.requirements,
    metadata: card.metadata,
    warning: card.warning,
    productionBox: card.productionBox,
    resourceType: card.resourceType,
    startingMegaCredits: startingMegaCredits,
    cardCost: cardCost,
  };

  json.push(clientCard);
}

if (!fs.existsSync('src/genfiles')) {
  fs.mkdirSync('src/genfiles');
}

fs.writeFileSync('src/genfiles/cards.json', JSON.stringify(json, null, 2));
