import {Player} from '../Player';
import {ColonyName} from '../colonies/ColonyName';
import {SelectColony} from '../inputs/SelectColony';
import {ColonyModel} from '../models/ColonyModel';
import {DeferredAction, Priority} from './DeferredAction';

export class RemoveColonyFromGame implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
  ) {}

  public execute() {
    const game = this.player.game;
    const coloniesModel: Array<ColonyModel> = game.getColoniesModel(game.colonies);
    const removeColony = new SelectColony('Select colony tile to remove', 'Remove colony', coloniesModel, (colonyName: ColonyName) => {
      game.colonies.forEach((colony) => {
        if (colony.name === colonyName) {
          game.colonies.splice(game.colonies.indexOf(colony), 1);
          if (game.colonyDealer === undefined) return;
          game.colonyDealer.discardedColonies.push(colony);
        }
        return undefined;
      });
      return undefined;
    });

    return removeColony;
  }
}
