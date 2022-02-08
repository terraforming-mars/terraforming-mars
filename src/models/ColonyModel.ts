
import {Color} from '../common/Color';
import {Game} from '../Game';
import {Colony} from '../colonies/Colony';
import {ColonyModel} from '../common/models/ColonyModel';

export namespace X {
  export function getColonyModel(game: Game, colonies: Array<Colony>) : Array<ColonyModel> {
    return colonies.map(
      (colony): ColonyModel => ({
        colonies: colony.colonies.map(
          (playerId): Color => game.getPlayerById(playerId).color,
        ),
        isActive: colony.isActive,
        name: colony.name,
        trackPosition: colony.trackPosition,
        visitor:
                colony.visitor === undefined ?
                  undefined :
                  game.getPlayerById(colony.visitor).color,
      }),
    );
  }
}
