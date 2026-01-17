import {IGlobalEvent} from '@/server/turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '@/server/turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().temperature(2).nbsp.cards(1).slash().influence();
});

export class SnowCover extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SNOW_COVER,
      description: 'Decrease temperature 2 steps. Draw 1 card per influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.KELVINISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.increaseTemperature(game.playersInGenerationOrder[0], -2);

    game.playersInGenerationOrder.forEach((player) => {
      player.drawCard(turmoil.getInfluence(player));
    });
  }
}
