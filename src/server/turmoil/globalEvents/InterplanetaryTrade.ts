import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class InterplanetaryTrade extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.INTERPLANETARY_TRADE,
      description: 'Gain 2 M€ for each space tag (max 5) and influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.UNITY,
      behavior: {
        stock: {
          megacredits: {
            tag: Tag.SPACE,
            each: 2,
            turmoil: {max: 5, influence: {}},
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.megacredits(2).slash().tag(Tag.SPACE).influence({size: Size.SMALL});
      }),
    });
  }
}
