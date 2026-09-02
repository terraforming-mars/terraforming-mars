import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class MicrogravityHealthProblems extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MICROGRAVITY_HEALTH_PROBLEMS,
      description: 'Lose 3 M€ for each colony (max 5, then reduced by influence).',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.SCIENTISTS,
      behavior: {
        lose: {
          stock: {
            megacredits: {
              colonies: {},
              turmoil: {max: 5, influence: {subtract: true}},
              each: 3,
            },
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.megacredits(-3).slash().colonies(1).influence({size: Size.SMALL});
      }),
    });
  }
}
