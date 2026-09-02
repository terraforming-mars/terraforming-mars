import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class BalancedDevelopment extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.BALANCED_DEVELOPMENT,
      description: 'Gain 2M€ for each Mars tag you have (max 5) and influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.MARS,
      behavior: {
        stock: {
          megacredits: {
            tag: Tag.MARS,
            each: 2,
            turmoil: {max: 5, influence: {}},
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.megacredits(2).slash().tag(Tag.MARS).influence({size: Size.SMALL});
      }),
    });
  }
}
