import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class VenusInfrastructure extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.VENUS_INFRASTRUCTURE,
      description: 'Gain 2 M€ per Venus tag (max 5) and influence.',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.UNITY,
      behavior: {
        stock: {
          megacredits: {
            tag: Tag.VENUS,
            each: 2,
            turmoil: {max: 5, influence: {}},
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.megacredits(2).slash().tag(Tag.VENUS).influence({size: Size.SMALL});
      }),
    });
  }
}
