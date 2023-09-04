import {DeferredAction} from './DeferredAction';
import {GiveColonyBonus} from './GiveColonyBonus';
import {IPlayer} from '../IPlayer';

export class DeferredActionsQueue {
  /**
   * The ID assigned to entries on the queue. Actions pushed on the queue earlier have lower IDs.
   */
  private nextId: number = 0;
  private queue: Array<DeferredAction> = [];

  get length(): number {
    return this.queue.length;
  }

  public push(action: DeferredAction): void {
    action.queueId = this.nextId++;
    this.queue.push(action);
  }

  /**
   * Run all the tasks for this player in priority order.
   */
  public runAllFor(player: IPlayer, cb: () => void): void {
    let action: DeferredAction | undefined;
    let idx = -1;

    for (let candidateIdx = this.queue.length - 1; candidateIdx >= 0; candidateIdx--) {
      const candidate: DeferredAction = this.queue[candidateIdx];
      if (candidate.player.id === player.id && (action === undefined || this.hasHigherPriority(candidate, action))) {
        action = candidate;
        idx = candidateIdx;
      }
    }
    if (action === undefined) {
      cb();
      return;
    }
    this.queue.splice(idx, 1);
    this.run(action, () => this.runAllFor(player, cb));
  }

  private hasHigherPriority(a: DeferredAction, b: DeferredAction) {
    return a.priority < b.priority || (a.priority === b.priority && a.queueId < b.queueId);
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

  /**
   * Run all the tasks in priority order until the queue is empty.
   */
  public runAll(cb: () => void): void {
    // const next = this.nextItemIndex();
    // const action = this.queue[next];
    // if (action === undefined) {
    //   cb();
    //   return;
    // }
    // this.queue.splice(next, 1);
    const action = this.pop();
    if (action === undefined) {
      cb();
      return;
    }
    this.run(action, () => this.runAll(cb));
  }

  // The following methods are used in tests
  public peek(): DeferredAction<any> | undefined {
    return this.queue[this.nextItemIndex()];
  }

  public pop(): DeferredAction<any> | undefined {
    return this.queue.splice(this.nextItemIndex(), 1)[0];
  }

  private run(action: DeferredAction, cb: () => void): void {
    // Special hook for trade bonus deferred actions
    // So that they happen for all players at the same time
    if (action instanceof GiveColonyBonus) {
      action.andThen(cb);
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

  /**
   * Run the next action in the queue. Used only for tests.
   */
  public runNext(): void {
    const action = this.pop();
    if (action !== undefined) {
      this.run(action, () => {});
    }
  }
}
