import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class Riots extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.RIOTS,
      description: 'Lose 4 M€ for each city tile (max 5, then reduced by influence).',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.REDS,
      behavior: {
        lose: {
          stock: {
            megacredits: {
              cities: {},
              all: false,
              turmoil: {max: 5, influence: {subtract: true}},
              each: 4,
            },
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.minus().megacredits(4).slash().city().influence({size: Size.SMALL});
      }),
    });
  }
}
