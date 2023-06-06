import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardResource} from '../../../common/CardResource';
import {max} from '../Options';

export class ExploratoryMiningSite extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.EXPLORATORY_MINING_SITE,
      cost: 21,
      tags: [Tag.RADIATION, Tag.BUILDING],
      requirements: CardRequirements.builder((b) => b.temperature(-14, {max})),
      victoryPoints: 2, 

      behavior: {
        production: {steel: 2},
        drawCard: 2,
        addResourcesToAnyCard: [
          {count: 1, type: CardResource.RADIATION},
        ],
      },

      metadata: {
        cardNumber: 'N75',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(2)).cards(2).radiations(1).asterix();
        }),
        description: 'Temperature must be -14 or lower. Increase your steel 2 production 2 steps. Draw 2 cards. Add 1 radiation to another card.',
      },
    });
  }
}
