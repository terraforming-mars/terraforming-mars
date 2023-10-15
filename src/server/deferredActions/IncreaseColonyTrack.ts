import {IPlayer} from '../IPlayer';
import {IColony} from '../colonies/IColony';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {LogHelper} from '../LogHelper';
import {Message} from '../../common/logs/Message';
import {newMessage} from '../logs/MessageBuilder';

export class IncreaseColonyTrack extends DeferredAction {
  constructor(
    player: IPlayer,
    public colony: IColony,
    public steps: number,
    public title: string | Message = newMessage('Increase ${0} colony track before trade', (b) => b.colony(colony)),
  ) {
    super(player, Priority.INCREASE_COLONY_TRACK);
  }

  public execute() {
    if (this.steps === 0) {
      this.cb(undefined);
      return undefined;
    }

    const options = new OrOptions();
    for (let step = this.steps; step > 0; step--) {
      options.options.push(
        new SelectOption(newMessage('Increase colony track ${0} step(s)', (b) => b.number(step)))
          .andThen(() => {
            this.colony.increaseTrack(step);
            LogHelper.logColonyTrackIncrease(this.player, this.colony, step);
            this.cb(undefined);
            return undefined;
          }),
      );
    }
    options.title = this.title;
    options.options.push(
      new SelectOption('Don\'t increase colony track').andThen(() => {
        this.cb(undefined);
        return undefined;
      }),
    );

    return options;
  }
}
