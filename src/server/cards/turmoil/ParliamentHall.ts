import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class ParliamentHall extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.PARLIAMENT_HALL,
      tags: [Tag.BUILDING],
      cost: 8,
      requirements: {party: PartyName.MARS},
      victoryPoints: 1,

      behavior: {
        production: {megacredits: {tag: Tag.BUILDING, per: 3}},
      },

      metadata: {
        cardNumber: 'T08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().building(3, {played});
          });
        }),
        description: 'Requires that Mars First are ruling or that you have 2 delegates there. Increase your M€ production 1 step for every 3 building tags you have, including this.',
      },
    });
  }
}
