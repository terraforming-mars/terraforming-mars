import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {IGame} from '../../IGame';

export class SnowCover extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SNOW_COVER,
      description: 'Decrease temperature 2 steps. Draw 1 card per influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.KELVINISTS,
      behavior: {
        drawCard: {
          count: {turmoil: {influence: {}}},
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.temperature(-2).nbsp.cards(1).slash().influence();
      }),
    });
  }

  public override bespokeResolve(game: IGame) {
    const temperature = game.getTemperature();
    game.increaseTemperature(game.playersInGenerationOrder[0], -2);
    const steps = (temperature - game.getTemperature()) / 2;
    if (steps > 0) {
      game.log('${0} decreased temperature ${1} step(s)', (b) => b.globalEvent(this).number(steps));
    }
  }
}
