import {Player} from '../Player';
import {IColony} from '../colonies/IColony';
import {SelectColony} from '../inputs/SelectColony';
import {DeferredAction, Priority} from './DeferredAction';

export class RemoveColonyFromGame extends DeferredAction {
  constructor(player: Player) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const game = this.player.game;
    const removeColony = new SelectColony('Select colony tile to remove', 'Remove colony', game.colonies, (colony: IColony) => {
      game.colonies.splice(game.colonies.indexOf(colony), 1);
      game.discardedColonies.push(colony);
      game.log('You discarded ${0}', (b) => b.colony(colony));
      return undefined;
    });
    removeColony.showTileOnly = true;

    return removeColony;
  }
}
