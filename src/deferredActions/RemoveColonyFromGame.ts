import {Player} from '../Player';
import {Colony} from '../colonies/Colony';
import {SelectColony} from '../inputs/SelectColony';
import {DeferredAction, Priority} from './DeferredAction';

export class RemoveColonyFromGame implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
  ) {}

  public execute() {
    const game = this.player.game;
    const removeColony = new SelectColony('Select colony tile to remove', 'Remove colony', game.colonies, (colony: Colony) => {
      game.colonies.splice(game.colonies.indexOf(colony), 1);
      game.colonyDealer?.discardedColonies.push(colony);
      return undefined;
    });

    return removeColony;
  }
}
