import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class JovianTaxRights extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.JOVIAN_TAX_RIGHTS,
      description: 'Increase M€ production 1 step for each colony. Gain 1 titanium for each influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.UNITY,
      behavior: {
        stock: {
          titanium: {turmoil: {influence: {}}},
        },
        production: {
          megacredits: {colonies: {}},
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(1)).slash().colonies(1).nbsp.titanium(1).slash().influence();
      }),
    });
  }
}
