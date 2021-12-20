import {Game} from '../Game';
import {Colony} from './Colony';
import {ColonyName} from './ColonyName';

export class ColoniesHandler {
  public static getColony(game: Game, colonyName: ColonyName, includeDiscardedColonies: boolean = false): Colony {
    let colony = game.colonies.find((c) => c.name === colonyName);
    if (colony !== undefined) return colony;
    if (includeDiscardedColonies === true && game.colonyDealer !== undefined) {
      colony = game.colonyDealer.discardedColonies.find((c) => c.name === colonyName);
      if (colony !== undefined) return colony;
    }
    throw new Error(`Unknown colony '${colonyName}'`);
  }
}
