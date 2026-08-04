import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class MinersOnStrike extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MINERS_ON_STRIKE,
      description: 'Lose 1 titanium for each Jovian tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.GREENS,
      behavior: {
        lose: {
          stock: {
            titanium: {
              tag: Tag.JOVIAN,
              turmoil: {max: 5, influence: {subtract: true}},
            },
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.minus().titanium(1).slash().tag(Tag.JOVIAN).influence({size: Size.SMALL});
      }),
    });
  }
}
