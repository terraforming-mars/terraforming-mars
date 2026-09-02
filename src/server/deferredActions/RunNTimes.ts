import {IPlayer} from '../IPlayer';
import {DeferredAction} from '../deferredActions/DeferredAction';
import {Priority} from '../deferredActions/Priority';
import {PlayerInput} from '../PlayerInput';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';

/**
 * Run a deferred action many times, dynamically calculating each time.
 * This is a Deferred Action helper for running the same action
 * several times, producing input results each time.
 *
 * Very often a series of deferred actions don't depend on a prior one, and
 * those don't need RunNTimes -- just defer the same action in a loop.
 *
 * But there are cases, like, selecting spaces, where you don't want to
 * make the same space eligible in a series of selections.
 */
export abstract class RunNTimes<T> extends DeferredAction<ReadonlyArray<T>> {
  private nth: number = 1;
  protected collection: Array<T> = [];

  constructor(player: IPlayer, private count: number, priority?: Priority) {
    super(player, priority);
  }

  protected abstract run(): PlayerInput | undefined;

  protected createTitle(header: string): Message {
    if (this.count < 1) {
      return message(header, () => {});
    }
    return message(header + ' (${0} of ${1})', ((b) => b.number(this.nth).number(this.count)));
  }

  protected next() {
    this.nth++;
    if (this.nth <= this.count) {
      return this.run();
    }
    this.cb(this.collection);
    return undefined;
  }

  public execute(): PlayerInput | undefined {
    if (this.count === 0) {
      return undefined;
    }
    return this.run();
  }
}
