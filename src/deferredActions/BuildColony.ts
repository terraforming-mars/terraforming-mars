import {Player} from '../Player';
import {SelectColony} from '../inputs/SelectColony';
import {Colony} from '../colonies/Colony';
import {DeferredAction, Priority} from './DeferredAction';

export class BuildColony implements DeferredAction {
  public priority = Priority.BUILD_COLONY;
  constructor(
    public player: Player,
    public allowDuplicate: boolean = false,
    public title: string = 'Select where to build a colony',
    public openColonies?: Array<Colony>,
    private options?: {
      // Custom for Vital Colony.
      giveBonusTwice?: boolean,
      cb?: (colony: Colony) => void,
    },
  ) {}

  public execute() {
    if (this.openColonies === undefined) {
      this.openColonies = this.player.game.colonies.filter((colony) =>
        colony.colonies.length < 3 &&
        (colony.colonies.includes(this.player.id) === false || this.allowDuplicate) &&
        colony.isActive);
    }

    if (this.openColonies.length === 0) {
      return undefined;
    }

    const openColonies = this.openColonies;

    return new SelectColony(this.title, 'Build', openColonies, (colony: Colony) => {
      colony.addColony(this.player, {giveBonusTwice: this.options?.giveBonusTwice ?? false});
      if (this.options?.cb) this.options.cb(colony);
      return undefined;
    });
  }
}
