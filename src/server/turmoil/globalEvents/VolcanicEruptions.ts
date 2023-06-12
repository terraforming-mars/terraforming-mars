import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.temperature(2).nbsp.production((pb)=>pb.heat(1)).slash().influence();
});

export class VolcanicEruptions extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.VOLCANIC_ERUPTIONS,
      description: 'Increase temperature 2 steps. Increase heat production 1 step per influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.KELVINISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.increaseTemperature(game.getPlayersInGenerationOrder()[0], 2);
    game.getPlayersInGenerationOrder().forEach((player) => {
      const amount = turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.production.add(Resource.HEAT, amount, {log: true, from: this.name});
      }
    });
  }
}
