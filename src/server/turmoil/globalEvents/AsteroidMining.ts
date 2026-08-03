import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class AsteroidMining extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.ASTEROID_MINING,
      description: 'Gain 1 titanium for each Jovian tag (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.UNITY,
      behavior: {
        stock: {
          titanium: {
            tag: Tag.JOVIAN,
            turmoil: {max: 5, influence: {}}},
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.titanium(1).slash().tag(Tag.JOVIAN).influence({size: Size.SMALL});
      }),
    });
  }
}
