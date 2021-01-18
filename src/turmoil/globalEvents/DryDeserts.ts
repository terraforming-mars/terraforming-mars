import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {RemoveOceanTile} from '../../deferredActions/RemoveOceanTile';
import {DryDesertsDeferredAction} from '../../deferredActions/DryDesertsDeferredAction';
import {MAX_OCEAN_TILES} from '../../constants';

export class DryDeserts implements IGlobalEvent {
    public name = GlobalEventName.DRY_DESERTS;
    public description = 'First player removes 1 ocean tile from the gameboard. Gain 1 standard resource per influence.';
    public revealedDelegate = PartyName.REDS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
      const oceansPlaced = game.board.getOceansOnBoard();
      const canRemoveOcean = oceansPlaced > 0 && oceansPlaced !== MAX_OCEAN_TILES;

      if (canRemoveOcean) {
        game.defer(new RemoveOceanTile(game.getPlayers()[0], 'Dry Deserts Global Event - Remove an Ocean tile from the board'));
      }

      game.getPlayers().forEach((player) => {
        if (turmoil.getPlayerInfluence(player) > 0) {
          game.defer(new DryDesertsDeferredAction(
            player,
            turmoil.getPlayerInfluence(player),
          ));
        }
      });
    }
}
