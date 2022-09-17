import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class EosChasmaNationalPark extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.EOS_CHASMA_NATIONAL_PARK,
      tags: [Tag.PLANT, Tag.BUILDING],
      cost: 16,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 2},
        stock: {plants: 3},
        addResourcesToAnyCard: {count: 1, type: CardResource.ANIMAL},
      },

      requirements: CardRequirements.builder((b) => b.temperature(-12)),
      metadata: {
        cardNumber: '026',
        description: 'Requires -12 C or warmer. Add 1 Animal TO ANY ANIMAL CARD. Gain 3 Plants. Increase your M€ production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.animals(1).asterix().plants(3).br;
          b.production((pb) => pb.megacredits(2));
        }),
      },
    });
  }
}
