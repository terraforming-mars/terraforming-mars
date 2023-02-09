import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class LunaGovernor extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 4,
      tags: [Tag.EARTH, Tag.EARTH],
      name: CardName.LUNA_GOVERNOR,
      cardType: CardType.AUTOMATED,

      behavior: {
        production: {megacredits: 2},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.EARTH, 3)),
      metadata: {
        cardNumber: 'C20',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Requires 3 Earth tags. Increase your M€ production 2 steps.',
      },
    });
  }
}
