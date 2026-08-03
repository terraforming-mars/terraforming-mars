import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class SnowCover extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SNOW_COVER,
      description: 'Decrease temperature 2 steps. Draw 1 card per influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.KELVINISTS,
      renderData: CardRenderer.builder((b) => {
        b.minus().temperature(2).nbsp.cards(1).slash().influence();
      }),
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.increaseTemperature(game.playersInGenerationOrder[0], -2);

    game.playersInGenerationOrder.forEach((player) => {
      player.drawCard(turmoil.getInfluence(player));
    });
  }
}
