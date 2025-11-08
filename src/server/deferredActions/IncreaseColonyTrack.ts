import {IPlayer} from '../IPlayer';
import {IColony} from '../colonies/IColony';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {LogHelper} from '../LogHelper';
import {message} from '../logs/MessageBuilder';

/**
 * Asks the player to increase the colony track as many steps as it can go.
 *
 * Player has the option to move zero, one, or as many steps as it can go.
 */
export class IncreaseColonyTrack extends DeferredAction {
  constructor(
    player: IPlayer,
    public colony: IColony,
    public steps: number,
  ) {
    super(player, Priority.INCREASE_COLONY_TRACK);
  }

  public execute() {
    if (this.steps === 0) {
      this.cb(undefined);
      return undefined;
    }

    const options = new OrOptions()
      .setTitle(message('Increase ${0} colony track before trade', (b) => b.colony(this.colony)));

    for (let step = this.steps; step > 0; step--) {
      options.options.push(
        new SelectOption(message('Increase colony track ${0} step(s)', (b) => b.number(step)))
          .andThen(() => {
            this.colony.increaseTrack(step);
            LogHelper.logColonyTrackIncrease(this.player, this.colony, step);
            this.cb(undefined);
            return undefined;
          }),
      );
    }

    options.options.push(
      new SelectOption('Don\'t increase colony track').andThen(() => {
        this.cb(undefined);
        return undefined;
      }),
    );

    return options;
  }
}
