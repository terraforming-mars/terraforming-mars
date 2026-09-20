import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class SolarFlare extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SOLAR_FLARE,
      description: 'Lose 3 M€ for each space tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.KELVINISTS,
      behavior: {
        lose: {
          stock: {
            megacredits: {
              tag: Tag.SPACE,
              turmoil: {max: 5, influence: {subtract: true}},
              each: 3,
            },
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.minus().megacredits(3).slash().tag(Tag.SPACE).influence({size: Size.SMALL});
      }),
    });
  }
}
