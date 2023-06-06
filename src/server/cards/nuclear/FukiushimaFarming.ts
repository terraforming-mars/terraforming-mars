import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import { CardResource } from '../../../common/CardResource';
import { digit } from '../Options';

export class FukushimaFarming extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.FUKUSHIMA_FARMING,
      tags: [Tag.RADIATION, Tag.MICROBE, Tag.PLANT],
      cost: 16,

      behavior: {
        production: {plants: 2},
        stock: {plants: 1},
        addResourcesToAnyCard: [
          {count: 2, type: CardResource.MICROBE},
          {count: 3, type: CardResource.RADIATION},
        ],
      },

      requirements: CardRequirements.builder((b) => b.temperature(-12)),
      metadata: {
        cardNumber: 'N14',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(2);
          }).br;
          b.plants(1).microbes(2, {digit}).asterix().nbsp.radiations(3, {digit}).asterix();
        }),
        description: 'Requires 12 C or warmer. Increase your plant production 2 steps. Gain 1 plant. Add 2 microbes to ANOTHER card. Add 3 radiation to ANOTHER Card.'}
      },
  )};
}
