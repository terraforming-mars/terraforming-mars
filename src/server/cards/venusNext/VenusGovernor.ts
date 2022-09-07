import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class VenusGovernor extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VENUS_GOVERNOR,
      cardType: CardType.AUTOMATED,
      tags: [Tag.VENUS, Tag.VENUS],
      cost: 4,

      requirements: CardRequirements.builder((b) => b.tag(Tag.VENUS, 2)),

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: '255',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Requires 2 Venus tags. Increase your M€ production 2 steps.',
      },
    });
  }
}
