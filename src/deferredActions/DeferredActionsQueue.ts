import {DeferredAction} from './DeferredAction';
import {GiveColonyBonus} from './GiveColonyBonus';
import {Heap} from 'mnemonist';

export class DeferredActionsQueue {
  private queue: Heap<DeferredAction> = new Heap((a, b) => {
    return (a.priority < b.priority) ? -1 : ((a.priority > b.priority) ? 1 : 0);
  });

  get length(): number {
    return this.queue.size;
  }

  public push(action: DeferredAction): void {
    this.queue.push(action);
  }

  public pop(): DeferredAction | undefined {
    return this.queue.pop();
  }

  public peek(): DeferredAction | undefined {
    return this.queue.peek();
  }

  public run(action: DeferredAction, cb: () => void): void {
    // Special hook for trade bonus deferred actions
    // So that they happen for all players at the same time
    if (action instanceof GiveColonyBonus) {
      (action as GiveColonyBonus).cb = cb;
      action.execute();
      return;
    }

    const input = action.execute();
    if (input !== undefined) {
      action.player.setWaitingFor(input, () => {
        cb();
      });
    } else {
      cb();
    }
  }

  public runAll(cb: () => void): void {
    const action = this.pop();
    if (action === undefined) {
      cb();
      return;
    }

    this.run(action, () => this.runAll(cb));
  }


  // The following methods are used in tests

  public runNext(): void {
    const action = this.pop();
    if (action !== undefined) {
      this.run(action, () => {});
    }
  }
}
