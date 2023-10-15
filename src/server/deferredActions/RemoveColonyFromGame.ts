import {IPlayer} from '../IPlayer';
import {SelectColony} from '../inputs/SelectColony';
import {DeferredAction, Priority} from './DeferredAction';

export class RemoveColonyFromGame extends DeferredAction {
  constructor(player: IPlayer) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const game = this.player.game;
    const removeColony = new SelectColony('Select colony tile to remove', 'Remove colony', game.colonies)
      .andThen((colony) => {
        game.colonies.splice(game.colonies.indexOf(colony), 1);
        game.discardedColonies.push(colony);
        game.log('You discarded ${0}', (b) => b.colony(colony));
        return undefined;
      });
    removeColony.showTileOnly = true;

    return removeColony;
  }
}
