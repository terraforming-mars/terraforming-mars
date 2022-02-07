import {CardName} from '@/common/cards/CardName';
import {ALL_CARD_MANIFESTS} from '@/cards/AllCards';
import {CardType} from '@/common/cards/CardType';
import {ICard} from '@/cards/ICard';
import {ICardFactory} from '@/cards/ICardFactory';
import {GameModule} from '@/common/cards/GameModule';

export type CardAndModule = {card: ICard, module: GameModule};
const cards: Map<CardName, CardAndModule> = new Map();
const cardArray: Array<CardAndModule> = [];
ALL_CARD_MANIFESTS.forEach((manifest) => {
  const module = manifest.module;
  [
    manifest.projectCards,
    manifest.corporationCards,
    manifest.preludeCards,
    manifest.standardProjects].forEach((deck) => {
    deck.factories.forEach((cf: ICardFactory<ICard>) => {
      const card: ICard = new cf.Factory();
      const cam = {card, module};
      cards.set(card.name, cam);
      cardArray.push(cam);
    });
  });
});

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
