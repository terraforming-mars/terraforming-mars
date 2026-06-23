import {CardModel} from '@/common/models/CardModel';
import {partition} from '@/common/utils/utils';
import {LocalStorageStore} from '@/client/utils/LocalStorageStore';

// Stored as cardName: position
type CardOrder = {[cardName: string]: number};

// Delete card orderings after 90 days. It's possible some locally hosted games
// will last longer, and that's unfortunate.
// TODO(kberg): Refresh upon load?
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

// TODO(2026-12-01): drop migrate (and the rewrite-forward support in LocalStorageStore)
const store = new LocalStorageStore<CardOrder>({
  prefix: 'cardOrder',
  ttlMs: TTL_MS,
  migrate: (raw) => {
    try {
      const parsed = JSON.parse(raw);
      // null check is necessary because typeof null is object.
      return (parsed !== null && typeof parsed === 'object') ? parsed as CardOrder : undefined;
    } catch {
      return undefined;
    }
  },
});

export class CardOrderStorage {
  public static getCardOrder(playerId: string): CardOrder {
    return store.get(playerId) ?? {};
  }

  public static getOrdered(order: CardOrder, cards: ReadonlyArray<CardModel>): ReadonlyArray<CardModel> {
    const [misses, hits] = partition(cards, (card: CardModel) => order[card.name] === undefined);
    hits.sort((a: CardModel, b: CardModel) => {
      return order[a.name] - order[b.name];
    });
    return hits.concat(misses);
  }

  public static updateCardOrder(playerId: string, order: CardOrder): void {
    store.set(playerId, order);
  }
}
