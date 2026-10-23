import {Priority} from './Priority';

type Entry<V, K> = {
  queueId: number;
  priority: Priority;
  key: K;
  entry: V;
};

/**
 * A list of entries managed by priority and by a caller-specified key.
 *
 * This implementation isn't terribly efficient for large lists, it's not expected to be
 * particularly large.
 */
export class PriorityQueue<V, K extends {}> {
  private queueId: number = 0;
  private queue: Array<Entry<V, K>> = [];

  constructor() {}

  get length(): number {
    return this.queue.length;
  }

  public push(entry: V, priority: Priority, key: K): void {
    this.queue.push({entry, key, priority, queueId: this.queueId++});
  }

  public pop(key?: K): V | undefined {
    return this.remove(this.nextItemIndex(key));
  }

  private remove(index: number): V | undefined {
    if (index === -1) {
      return undefined;
    }
    return this.queue.splice(index, 1)[0]?.entry;
  }

  public peek(): V | undefined {
    return this.queue[this.nextItemIndex()]?.entry;
  }

  private hasHigherPriority(a: Entry<unknown, unknown>, b: Entry<unknown, unknown>) {
    return a.priority < b.priority || (a.priority === b.priority && a.queueId < b.queueId);
  }

  /** Index of the highest-priority entry, limited to `key` when given. -1 if none. */
  private nextItemIndex(key?: K): number {
    let bestCandidate = -1;
    for (let i = 0; i < this.queue.length; i++) {
      const candidate = this.queue[i];

      // If key is supplied, skip entries that don't match it.
      if (key !== undefined && candidate.key !== key) {
        continue;
      }

      if (bestCandidate === -1 || this.hasHigherPriority(candidate, this.queue[bestCandidate])) {
        bestCandidate = i;
      }
    }
    return bestCandidate;
  }
}
