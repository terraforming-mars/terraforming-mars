import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class AquiferReleasedByPublicCouncil extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL,
      description: 'First player places an ocean tile. Gain 1 plant and 1 steel per influence.',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.GREENS,
      behavior: {
        once: {ocean: {}},
        stock: {
          plants: {turmoil: {influence: {}}},
          steel: {turmoil: {influence: {}}},
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.oceans(1).nbsp.plants(1).steel(1).slash().influence();
      }),
    });
  }
}
