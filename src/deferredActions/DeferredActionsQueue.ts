import {DeferredAction} from './DeferredAction';
import {GiveColonyBonus} from './GiveColonyBonus';

export class DeferredActionsQueue {
    private queue: Array<DeferredAction> = [];

    get length(): number {
      return this.queue.length;
    }

    public unshift(action: DeferredAction): void {
      this.queue.unshift(action);
    }

    public push(action: DeferredAction): void {
      this.queue.push(action);
    }

    public next(): DeferredAction | undefined {
      return this.queue[0];
    }

    public remove(action: DeferredAction): void {
      this.queue.splice(this.queue.indexOf(action), 1);
    }

    public run(action: DeferredAction, cb: () => void): void {
      // Special hook for trade bonus deferred actions
      // So that they happen for all players at the same time
      if (action instanceof GiveColonyBonus) {
        this.remove(action);
        (action as GiveColonyBonus).cb = cb;
        action.execute();
        return;
      }

      const input = action.execute();
      if (input !== undefined) {
        action.player.setWaitingFor(input, () => {
          this.remove(action);
          cb();
        });
      } else {
        this.remove(action);
        cb();
      }
    }

    public runAll(cb: () => void): void {
      const action = this.next();
      if (action === undefined) {
        cb();
        return;
      }

      this.run(action, () => this.runAll(cb));
    }


    // The following methods are used in tests

    public shift(): DeferredAction | undefined {
      return this.queue.shift();
    }

    public runNext(): void {
      const action = this.next();
      if (action !== undefined) {
        this.run(action, () => {});
      }
    }
}
