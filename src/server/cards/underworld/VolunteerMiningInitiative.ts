import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';

export class VolunteerMiningInitiative extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VOLUNTEER_MINING_INITIATIVE,
      type: CardType.EVENT,
      cost: 12,
      tags: [Tag.MARS],

      behavior: {
        underworld: {excavate: {count: {cities: {}, all: true, per: 3}}},
      },

      metadata: {
        cardNumber: 'U73',
        renderData: CardRenderer.builder((b) => {
          b.excavate(1).slash().text('3').city({all});
        }),
        description: 'Excavate 1 underground resource for every 3 cities in play.',
      },
    });
  }
}
