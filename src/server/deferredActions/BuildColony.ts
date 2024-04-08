import {IPlayer} from '../IPlayer';
import {SelectColony} from '../inputs/SelectColony';
import {IColony} from '../colonies/IColony';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';

export class BuildColony extends DeferredAction<IColony> {
  constructor(
    player: IPlayer,
    private options?: {
      allowDuplicate?: boolean, // Allow placing a colony on a tile that already has a colony.
      title?: string,
      colonies?: Array<IColony>, // If not specified, will accept all playable colonies.
      giveBonusTwice?: boolean, // Custom for Vital Colony. Rewards the bonus when placing a colony a second time.
    },
  ) {
    super(player, Priority.BUILD_COLONY);
  }

  public execute() {
    const colonies = this.options?.colonies || this.player.colonies.getPlayableColonies(this.options?.allowDuplicate);

    if (colonies.length === 0) {
      return undefined;
    }

    const title = this.options?.title ?? 'Select where to build a colony';
    return new SelectColony(title, 'Build', colonies)
      .andThen((colony: IColony) => {
        colony.addColony(this.player, {giveBonusTwice: this.options?.giveBonusTwice ?? false});
        this.cb(colony);
        return undefined;
      });
  }
}
