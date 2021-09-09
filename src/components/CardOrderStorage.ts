
import {CardModel} from '@/models/CardModel';

const STORAGE_PREFIX = 'cardOrder';

export class CardOrderStorage {
  public static getCardOrder(playerId: string): {[x: string]: number} {
    try {
      const order = typeof localStorage === 'undefined' ? null : localStorage.getItem(`${STORAGE_PREFIX}${playerId}`);
      if (order === null) {
        return {};
      }
      return JSON.parse(order);
    } catch (err) {
      console.warn('unable to pull card order from local storage', err);
      return {};
    }
  }
  public static getOrdered(order: {[x: string]: number}, cards: Array<CardModel>): Array<CardModel> {
    const misses = cards.filter((card) => order[card.name] === undefined);
    const hits = cards.filter((card) => order[card.name] !== undefined);
    hits.sort((a, b) => {
      return order[a.name] - order[b.name];
    });
    return hits.concat(misses);
  }
  public static updateCardOrder(playerId: string, order: {[x: string]: number}): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${playerId}`, JSON.stringify(order));
    } catch (err) {
      console.warn('unable to update card order with local storage', err);
    }
  }
}

