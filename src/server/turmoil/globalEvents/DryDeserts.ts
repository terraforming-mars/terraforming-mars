import {IGlobalEvent} from '@/server/turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '@/server/turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {RemoveOceanTile} from '@/server/deferredActions/RemoveOceanTile';
import {GainResources} from '@/server/inputs/GainResources';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {message} from '@/server/logs/MessageBuilder';

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
  public resolve(game: IGame, turmoil: Turmoil) {
    if (game.canRemoveOcean()) {
      game.defer(new RemoveOceanTile(game.playersInGenerationOrder[0], 'Dry Deserts Global Event - Remove an Ocean tile from the board'));
    }

    game.playersInGenerationOrder.forEach((player) => {
      const count = turmoil.getInfluence(player);
      if (count > 0) {
        player.defer(new GainResources(
          player,
          count,
          message('Dry Deserts Global Event - Gain ${0} resource(s) for influence', (b) => b.number(count)),
        ));
      }
    });
  }
}
