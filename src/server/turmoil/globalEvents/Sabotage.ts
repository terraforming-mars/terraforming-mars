import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class Sabotage extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SABOTAGE,
      description: 'Decrease steel and energy production 1 step each. Gain 1 steel per influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.REDS,
      behavior: {
        lose: {
          production: {energy: 1, steel: 1},
        },
        stock: {
          steel: {turmoil: {influence: {}}},
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.minus().energy(1).steel(1)).nbsp.nbsp;
        b.steel(1).slash().influence({size: Size.MEDIUM});
      }),
    });
  }
}
