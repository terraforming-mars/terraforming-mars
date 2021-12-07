import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {RemoveOceanTile} from '../../deferredActions/RemoveOceanTile';
import {SelectResourcesDeferred} from '../../deferredActions/SelectResourcesDeferred';
import {MAX_OCEAN_TILES} from '../../constants';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().oceans(1).br.wild(1).slash().influence();
});

export class DryDeserts extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.DRY_DESERTS,
      description: 'First player removes 1 ocean tile from the gameboard. Gain 1 standard resource per influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    const oceansPlaced = game.board.getOceansOnBoard();
    const canRemoveOcean = oceansPlaced > 0 && oceansPlaced !== MAX_OCEAN_TILES;

    if (canRemoveOcean) {
      game.defer(new RemoveOceanTile(game.getPlayers()[0], 'Dry Deserts Global Event - Remove an Ocean tile from the board'));
    }

    game.getPlayers().forEach((player) => {
      const count = turmoil.getPlayerInfluence(player);
      if (count > 0) {
        game.defer(new SelectResourcesDeferred(
          player,
          count,
          'Dry Deserts Global Event - Gain ' + count + ' resource(s) for influence',
        ));
      }
    });
  }
}
