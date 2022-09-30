import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Insects extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INSECTS,
      tags: [Tag.MICROBE],
      cost: 9,

      behavior: {
        production: {plants: {tag: Tag.PLANT}},
      },

      requirements: CardRequirements.builder((b) => b.oxygen(6)),
      metadata: {
        cardNumber: '148',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1).slash().plants(1, {played}));
        }),
        description: 'Requires 6% oxygen. Increase your plant production 1 step for each plant tag you have.',
      },
    });
  }
}
