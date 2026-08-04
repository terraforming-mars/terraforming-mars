import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class VolcanicEruptions extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.VOLCANIC_ERUPTIONS,
      description: 'Increase temperature 2 steps. Increase heat production 1 step per influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.KELVINISTS,
      behavior: {
        production: {heat: {turmoil: {influence: {}}}},
      },
      renderData: CardRenderer.builder((b) => {
        b.temperature(2).nbsp.production((pb)=>pb.heat(1)).slash().influence();
      }),
    });
  }
  public override bespokeResolve(game: IGame) {
    game.increaseTemperature(game.playersInGenerationOrder[0], 2);
  }
}
