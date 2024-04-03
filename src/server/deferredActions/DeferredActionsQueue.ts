import {IDeferredAction} from './DeferredAction';
import {GiveColonyBonus} from './GiveColonyBonus';
import {IPlayer} from '../IPlayer';

export class DeferredActionsQueue {
  /** Array of Deferred Actions sorted in order of when to be executed */
  private queue: Array<IDeferredAction<any>> = [];

  /** Gets if the Queue is empty */
  public get IsEmpty(): boolean {
    return this.queue.length === 0;
  }

  /** Adds a deferred action to the queue, then sorts the queue. */
  public push(action: IDeferredAction<any>): void {
    this.queue.push(action);
    // Because 'push' add actions to the end of an array, actions with the same priority will always
    // be organized such that whichever action was added the queue first will be executed first
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  /** Starts a callback loop that resolves every action in the queue for 1 particular player */
  public runAllFor(player: IPlayer, cb: () => void): void {
    let action: IDeferredAction | undefined;
    while (action?.player !== player && !this.IsEmpty) {
      action = this.queue.shift();
    }
    if (action) {
      this.run(action, () => this.runAllFor(player, cb));
    } else {
      cb();
    }
  }

  /** Starts a callback loop that resolves every action in the queue */
  public runAll(cb: () => void): void {
    const action = this.queue.shift();
    if (action) {
      this.run(action, () => this.runAll(cb));
    } else {
      cb();
    }
  }

  // This function should be moved to the DeferredAction class, so GiveColonyBonus can override the function, instead using of this hook
  /** Resolves a single action. */
  public run(action: IDeferredAction, cb: () => void): void {
    // GiveColonyBonus hook so that all players can give a response at the same time.
    if (action instanceof GiveColonyBonus) {
      action.andThen(cb);
      action.execute();
      return;
    }
    const input = action.execute();
    if (input) {
      action.player.setWaitingFor(input, cb);
    } else {
      cb();
    }
  }

  // The following methods are used in tests
  public peek(): IDeferredAction<any> | undefined {
    return this.queue[0];
  }

  public pop(): IDeferredAction<any> | undefined {
    return this.queue.shift();
  }
}
