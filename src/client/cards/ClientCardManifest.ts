import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {GameModule} from '@/common/cards/GameModule';
import {IClientCard} from '@/common/cards/IClientCard';
// @ts-ignore cards.json doesn't exist during npm run build
import * as cardJson from '@/genfiles/cards.json';

// TODO(kberg): remove CardAndModule once separation is complete; IClientCard can contain the module.
export type CardAndModule = {card: IClientCard, module: GameModule};
const cards: Map<CardName, CardAndModule> = new Map();
const cardArray: Array<CardAndModule> = [];

export function getCard(cardName: CardName): CardAndModule | undefined {
  return cards.get(cardName);
}

export function getCards(filter: (card: CardAndModule) => boolean): Array<CardAndModule> {
  return cardArray.filter(filter);
}

export function byType(cardType: CardType): (cam: CardAndModule) => boolean {
  return (cam) => cam.card.cardType === cardType;
}

export function byModule(module: GameModule): (cam: CardAndModule) => boolean {
  return (cam) => cam.module === module;
}

export const toName = (cam: CardAndModule) => cam.card.name;

function initialize() {
  (cardJson as any as Array<IClientCard>).forEach((card) => {
    const module = card.module ?? GameModule.Base;
    const cam = {module, card};
    cards.set(card.name, cam);
    cardArray.push(cam);
  });
}

initialize();
