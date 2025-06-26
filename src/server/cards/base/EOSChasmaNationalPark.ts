import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';

export class EosChasmaNationalPark extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.EOS_CHASMA_NATIONAL_PARK,
      tags: [Tag.PLANT, Tag.BUILDING],
      cost: 16,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 2},
        stock: {plants: 3},
        addResourcesToAnyCard: {count: 1, type: CardResource.ANIMAL},
      },

      requirements: {temperature: -12},
      metadata: {
        cardNumber: '026',
        description: 'Requires -12 C or warmer. Add 1 animal TO ANY ANIMAL CARD. Gain 3 plants. Increase your M€ production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.ANIMAL).asterix().plants(3).br;
          b.production((pb) => pb.megacredits(2));
        }),
      },
    });
  }
}
