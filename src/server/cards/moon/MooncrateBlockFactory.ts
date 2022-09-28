import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';

export class MooncrateBlockFactory extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MOONCRATE_BLOCK_FACTORY,
      cardType: CardType.ACTIVE,
      tags: [Tag.BUILDING],
      cost: 8,
      requirements: CardRequirements.builder((b) => b.miningTiles(1)),

      // Behavior is in MoonHabitatStandardProject, MoonMineStandardProject and MoonRoadStandardProject.

      metadata: {
        description: 'Requires 1 mine on The Moon.',
        cardNumber: 'M38',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you pay for a Lunar standard project, you spend 4M€ less.', (eb) => {
            eb.plate('Lunar standard projects').startEffect.megacredits(-4);
          });
        }),
      },
    });
  }
}
