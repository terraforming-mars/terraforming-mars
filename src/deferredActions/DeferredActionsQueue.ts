import {DeferredAction} from './DeferredAction';
import {Game} from '../Game';
import {GiveColonyBonus} from './GiveColonyBonus';
import {Heap} from 'mnemonist';
import {PlayerCallback} from '../server/PlayerCallback';
import {PlayerCallbackId} from '../server/PlayerCallbackId';

export class DeferredActionsQueue {
  private static readonly RunAll = class implements PlayerCallback {
    public readonly id = PlayerCallbackId.RUN_ALL;
    public game: Game;
    constructor(public cb: PlayerCallback) {
      this.game = cb.game;
    }
    public execute() {
      this.game.deferredActions.runAll(this.cb);
    }
  }

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

  public run(action: DeferredAction, cb: PlayerCallback): void {
    // Special hook for trade bonus deferred actions
    // So that they happen for all players at the same time
    if (action instanceof GiveColonyBonus) {
      (action as GiveColonyBonus).cb = cb;
      action.execute();
      return;
    }

    const input = action.execute();
    if (input !== undefined) {
      action.player.setWaitingFor(input, cb);
    } else {
      cb.execute();
    }
  }

  public runAll(cb: PlayerCallback): void {
    const action = this.pop();
    if (action === undefined) {
      cb.execute();
      return;
    }

    this.run(action, new DeferredActionsQueue.RunAll(cb));
  }
}
