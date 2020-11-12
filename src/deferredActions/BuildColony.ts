import {Game} from '../Game';
import {Player} from '../Player';
import {SelectColony} from '../inputs/SelectColony';
import {ColonyName} from '../colonies/ColonyName';
import {ColonyModel} from '../models/ColonyModel';
import {DeferredAction} from './DeferredAction';

export class BuildColony implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public allowDuplicate: boolean = false,
        public title: string = 'Select where to build a colony',
  ) {}

  public execute() {
    const openColonies = this.game.colonies.filter((colony) => colony.colonies.length < 3 &&
            (colony.colonies.indexOf(this.player.id) === -1 || this.allowDuplicate) &&
            colony.isActive);
    if (openColonies.length === 0) {
      return undefined;
    }

    const coloniesModel: Array<ColonyModel> = this.game.getColoniesModel(openColonies);
    return new SelectColony(this.title, 'Build', coloniesModel, (colonyName: ColonyName) => {
      openColonies.forEach((colony) => {
        if (colony.name === colonyName) {
          colony.onColonyPlaced(this.player, this.game);
        }
        return undefined;
      });
      return undefined;
    });
  }
}
