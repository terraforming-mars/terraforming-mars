import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Tag} from '../../../common/cards/Tag';

export class CelebrityLeaders extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.CELEBRITY_LEADERS,
      description: 'Gain 2 M€ for each event played (max 5) and influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.GREENS,
      behavior: {
        stock: {
          megacredits: {
            eventsPlayed: true,
            each: 2,
            turmoil: {max: 5, influence: {}},
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.megacredits(2).slash().tag(Tag.EVENT).influence({size: Size.SMALL});
      }),
    });
  }
}
