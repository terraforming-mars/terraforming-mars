import {Player} from '../Player';
import {SelectColony} from '../inputs/SelectColony';
import {IColony} from '../colonies/IColony';
import {DeferredAction, Priority} from './DeferredAction';

export class BuildColony extends DeferredAction {
  constructor(
    player: Player,
    public allowDuplicate: boolean = false,
    public title: string = 'Select where to build a colony',
    public openColonies?: Array<IColony>,
    private options?: {
      // Custom for Vital Colony.
      giveBonusTwice?: boolean,
      cb?: (colony: IColony) => void,
    },
  ) {
    super(player, Priority.BUILD_COLONY);
  }

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

    return new SelectColony(this.title, 'Build', openColonies, (colony: IColony) => {
      colony.addColony(this.player, {giveBonusTwice: this.options?.giveBonusTwice ?? false});
      if (this.options?.cb) this.options.cb(colony);
      return undefined;
    });
  }
}
