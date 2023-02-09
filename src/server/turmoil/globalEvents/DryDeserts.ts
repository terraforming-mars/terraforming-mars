import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {RemoveOceanTile} from '../../deferredActions/RemoveOceanTile';
import {SelectResourcesDeferred} from '../../deferredActions/SelectResourcesDeferred';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().oceans(1).nbsp.nbsp.wild(1).slash().influence();
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
    if (game.canRemoveOcean()) {
      game.defer(new RemoveOceanTile(game.getPlayersInGenerationOrder()[0], 'Dry Deserts Global Event - Remove an Ocean tile from the board'));
    }

    game.getPlayersInGenerationOrder().forEach((player) => {
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
