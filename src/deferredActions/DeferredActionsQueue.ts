import {DeferredAction} from './DeferredAction';
import {GiveColonyBonus} from './GiveColonyBonus';
import {Heap} from 'mnemonist';
import {Player} from '../Player';

export class DeferredActionsQueue {
  private insertId: number = 0;

  private queue: Heap<DeferredAction> = new Heap((a, b) => {
    if (a.priority === b.priority) {
      return (a.queueId! < b.queueId!) ? -1 : 1;
    }
    return a.priority - b.priority;
  });

  get length(): number {
    return this.queue.size;
  }

  // only used publicly by tests
  public pop(): DeferredAction | undefined {
    return this.queue.pop();
  }

  public push(action: DeferredAction): void {
    action.queueId = this.insertId++;
    this.queue.push(action);
  }

  // only used publicly by tests
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

  public hasActionFor(player: Player): boolean {
    return this.queue.toArray().some((da) => da.player?.id === player.id);
  }

  public runAllFor(player: Player, cb: () => void): void {
    if (this.hasActionFor(player) === false) {
      cb();
      return;
    }
    let action: DeferredAction | undefined;
    let otherActions: Array<DeferredAction> = [];
    let playerAction: DeferredAction | undefined;
    while (this.queue.size > 0) {
      action = this.pop();
      if (action !== undefined) {
        if (action.player?.id === player.id) {
          playerAction = action;
          break;
        }
        otherActions.push(action);
      }
    }
    // add back the other actions
    otherActions.forEach((oa) => this.push(oa));
    if (playerAction === undefined) {
      throw new Error('did not find player when expected!');
    }
    this.run(playerAction, () => this.runAllFor(player, cb));
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
  public peek(): DeferredAction | undefined {
    return this.queue.peek();
  }

  public runNext(): void {
    const action = this.pop();
    if (action !== undefined) {
      this.run(action, () => {});
    }
  }
}
