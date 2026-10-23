import {IDeferredAction} from './DeferredAction';
import {GiveColonyBonus} from './GiveColonyBonus';
import {IPlayer} from '../IPlayer';
import {PlayerId} from '../../common/Types';
import {PriorityQueue} from './PriorityQueue';

export class DeferredActionsQueue {
  private queue = new PriorityQueue<IDeferredAction<any>, PlayerId>();

  get length(): number {
    return this.queue.length;
  }

  public push(action: IDeferredAction<any>): void {
    this.queue.push(action, action.priority, action.player.id);
  }

  // Public for tests
  public peek(): IDeferredAction<any> | undefined {
    return this.queue.peek();
  }

  // Public for tests
  public pop(): IDeferredAction<any> | undefined {
    return this.queue.pop();
  }

  // Public for tests
  public runNext(): void {
    const action = this.queue.pop();
    if (action !== undefined) {
      this.runInline(action, () => {});
    }
  }

  public runAll(cb: () => void): void {
    this.drain(undefined, cb);
  }


  public runAllFor(player: IPlayer, cb: () => void): void {
    this.drain(player.id, cb);
  }

  /** Runs queued actions, limited to `playerId` when given, then calls `cb`. */
  private drain(playerId: PlayerId | undefined, cb: () => void): void {
    let action = this.queue.pop(playerId);
    while (action !== undefined) {
      if (!this.runInline(action, () => this.drain(playerId, cb))) {
        return;
      }
      action = this.queue.pop(playerId);
    }
    cb();
  }

  /**
   * Runs `action`. Returns true when it finished immediately, in which case `cb` is not called.
   * Otherwise `cb` is called once the action finishes.
   */
  private runInline(action: IDeferredAction, cb: () => void): boolean {
    // Special hook for trade bonus deferred actions
    // So that they happen for all players at the same time
    if (action instanceof GiveColonyBonus) {
      action.andThen(cb);
      action.execute();
      return false;
    }

    const input = action.execute();
    if (input !== undefined) {
      action.player.setWaitingFor(input, cb);
      return false;
    }
    return true;
  }
}
