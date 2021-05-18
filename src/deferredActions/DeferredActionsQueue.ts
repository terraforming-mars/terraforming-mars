import {DeferredAction} from './DeferredAction';
import {GiveColonyBonus} from './GiveColonyBonus';
import {Player} from '../Player';

export class DeferredActionsQueue {
  private insertId: number = 0;
  private queue: Array<DeferredAction> = [];

  get length(): number {
    return this.queue.length;
  }

  public push(action: DeferredAction): void {
    action.queueId = this.insertId++;
    this.queue.push(action);
  }

  public runAllFor(player: Player, cb: () => void): void {
    let b: DeferredAction | undefined;
    let j = -1;
    for (let i = this.queue.length - 1; i >= 0; i--) {
      const a = this.queue[i];
      if (a.player.id === player.id && (b === undefined || this.hasHigherPriority(a, b))) {
        b = a;
        j = i;
      }
    }
    if (b === undefined) {
      cb();
      return;
    }
    this.queue.splice(j, 1);
    this.run(b, () => this.runAllFor(player, cb));
  }

  private hasHigherPriority(a: DeferredAction, b: DeferredAction) {
    return a.priority < b.priority || (a.priority === b.priority && a.queueId! < b.queueId!);
  }

  private nextItemIndex(): number {
    if (this.queue.length === 0) {
      return -1;
    }
    let b = this.queue[0];
    let j = 0;
    for (let i = this.queue.length - 1; i >= 1; i--) {
      const a = this.queue[i];
      if (this.hasHigherPriority(a, b)) {
        b = a;
        j = i;
      }
    }
    return j;
  }

  public runAll(cb: () => void): void {
    const next = this.nextItemIndex();
    const action = this.queue[next];
    if (action === undefined) {
      cb();
      return;
    }
    this.queue.splice(next, 1);
    this.run(action, () => this.runAll(cb));
  }

  // The following methods are used in tests
  public peek(): DeferredAction | undefined {
    return this.queue[this.nextItemIndex()];
  }

  public pop(): DeferredAction | undefined {
    return this.queue.splice(this.nextItemIndex(), 1)[0];
  }

  public run(action: DeferredAction, cb: () => void): void {
    // Special hook for trade bonus deferred actions
    // So that they happen for all players at the same time
    if (action instanceof GiveColonyBonus) {
      action.cb = cb;
      action.execute();
      return;
    }

    const input = action.execute();
    if (input !== undefined) {
      action.player.setWaitingFor(input, cb);
    } else {
      cb();
    }
  }

  public runNext(): void {
    const action = this.pop();
    if (action !== undefined) {
      this.run(action, () => {});
    }
  }
}
