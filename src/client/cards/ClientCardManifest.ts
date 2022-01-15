import {CardName} from '@/CardName';
import {ALL_CARD_MANIFESTS} from '@/cards/AllCards';
import {CardType} from '@/cards/CardType';
import {ICard} from '@/cards/ICard';
import {ICardFactory} from '@/cards/ICardFactory';
import {GameModule} from '@/GameModule';

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
console.log(cardArray.map((cam) => cam.card.name));

export function getCard(cardName: CardName): CardAndModule | undefined {
  return cards.get(cardName);
}

export function getCards(filter: (card: CardAndModule) => boolean): Array<CardAndModule> {
  return cardArray.filter(filter);
}

export function getCardsByType(cardType: CardType): Array<CardAndModule> {
  return getCards((cam) => cam.card.cardType === cardType);
}
