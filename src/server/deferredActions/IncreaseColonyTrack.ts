import {IPlayer} from '../IPlayer';
import {IColony} from '../colonies/IColony';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {LogHelper} from '../LogHelper';

export class IncreaseColonyTrack extends DeferredAction {
  constructor(
    player: IPlayer,
    public colony: IColony,
    public steps: number,
    public title: string = 'Increase ' + colony.name + ' colony track before trade',
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
        new SelectOption('Increase colony track ' + step + ' step(s)', 'Confirm').andThen(() => {
          this.colony.increaseTrack(step);
          LogHelper.logColonyTrackIncrease(this.player, this.colony, step);
          this.cb(undefined);
          return undefined;
        }),
      );
    }
    options.title = this.title;
    options.options.push(
      new SelectOption('Don\'t increase colony track', 'Confirm').andThen(() => {
        this.cb(undefined);
        return undefined;
      }),
    );

    return options;
  }
}
