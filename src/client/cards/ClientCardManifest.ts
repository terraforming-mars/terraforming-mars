import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {GameModule} from '@/common/cards/GameModule';
import {IClientCard} from '@/common/cards/IClientCard';
// @ts-ignore cards.json doesn't exist during npm run build
import * as cardJson from '@/genfiles/cards.json';

const cards: Map<CardName, IClientCard> = new Map();
const cardArray: Array<IClientCard> = [];

export function getCard(cardName: CardName): IClientCard | undefined {
  return cards.get(cardName);
}

export function getCardOrThrow(cardName: CardName): IClientCard {
  const card = getCard(cardName);
  if (card === undefined) {
    throw new Error(`card not found ${cardName}`);
  }
  return card;
}

export function getCards(filter: (card: IClientCard) => boolean): Array<IClientCard> {
  return cardArray.filter(filter);
}

export function byType(cardType: CardType): (card: IClientCard) => boolean {
  return (card) => card.cardType === cardType;
}

export function byModule(module: GameModule): (card: IClientCard) => boolean {
  return (card) => card.module === module;
}

export const toName = (card: IClientCard) => card.name;

function initialize() {
  (cardJson as any as Array<IClientCard>).forEach((card) => {
    cards.set(card.name, card);
    cardArray.push(card);
  });
}

initialize();
