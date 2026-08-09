import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class Pandemic extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.PANDEMIC,
      description: 'Lose 3 M€ for each building tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.GREENS,
      currentDelegate: PartyName.MARS,
      behavior: {
        lose: {
          stock: {
            megacredits: {
              tag: Tag.BUILDING,
              turmoil: {max: 5, influence: {subtract: true}},
              each: 3,
            },
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.megacredits(-3).slash().tag(Tag.BUILDING).influence({size: Size.SMALL});
      }),
    });
  }
}
