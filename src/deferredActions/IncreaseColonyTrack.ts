import {Player} from '../Player';
import {IColony} from '../colonies/IColony';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {LogHelper} from '../LogHelper';

export class IncreaseColonyTrack implements DeferredAction {
  public priority = Priority.INCREASE_COLONY_TRACK;
  constructor(
        public player: Player,
        public colony: IColony,
        public steps: number,
        public cb: () => void,
        public title: string = 'Increase ' + colony.name + ' colony track before trade',
  ) {}

  public execute() {
    if (this.steps === 0) {
      this.cb();
      return undefined;
    }

    const options = new OrOptions();
    for (let step = this.steps; step > 0; step--) {
      options.options.push(
        new SelectOption('Increase colony track ' + step + ' step(s)', 'Confirm', () => {
          this.colony.increaseTrack(step);
          LogHelper.logColonyTrackIncrease(this.player, this.colony, step);
          this.cb();
          return undefined;
        }),
      );
    }
    options.title = this.title;
    options.options.push(
      new SelectOption('Don\'t increase colony track', 'Confirm', () => {
        this.cb();
        return undefined;
      }),
    );

    return options;
  }
}
