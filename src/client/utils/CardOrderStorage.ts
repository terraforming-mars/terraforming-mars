import {CardModel} from '@/common/models/CardModel';
import {partition} from '@/common/utils/utils';
import {LocalStorageStore} from '@/client/utils/LocalStorageStore';

type CardOrder = {[x: string]: number};

// Per-player card ordering. The TTL (refreshed on every write) bounds growth so
// orderings from games no longer being played are eventually swept; an actively
// played game keeps refreshing its entry well within the window.
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// The prefix matches the pre-refactor key namespace, and migrate() interprets a
// pre-refactor value (a bare JSON order object, with no envelope) so existing
// orderings are kept and rewritten with a fresh ttl rather than dropped.
// TODO(2026-09-01): drop migrate (and the rewrite-forward support in
// LocalStorageStore) once the 30-day ttl guarantees no pre-refactor orderings
// remain.
const store = new LocalStorageStore<CardOrder>({
  prefix: 'cardOrder',
  ttlMs: TTL_MS,
  migrate: (raw) => {
    try {
      const parsed = JSON.parse(raw);
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
