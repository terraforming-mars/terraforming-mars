import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../..//IPlayer';
import {IStandardProjectCard} from '../IStandardProjectCard';

export class MooncrateBlockFactory extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MOONCRATE_BLOCK_FACTORY,
      type: CardType.ACTIVE,
      tags: [Tag.BUILDING],
      cost: 8,
      requirements: {miningTiles: 1, all: true},

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

  private readonly standardProjects = new Set(Array.from(
    [CardName.MOON_MINE_STANDARD_PROJECT,
      CardName.MOON_ROAD_STANDARD_PROJECT,
      CardName.MOON_MINE_STANDARD_PROJECT,
      CardName.MOON_HABITAT_STANDARD_PROJECT,
      CardName.MOON_ROAD_STANDARD_PROJECT_VARIANT_1,
      CardName.MOON_MINE_STANDARD_PROJECT_VARIANT_1,
      CardName.MOON_HABITAT_STANDARD_PROJECT_VARIANT_1,
      CardName.MOON_ROAD_STANDARD_PROJECT_VARIANT_2,
      CardName.MOON_MINE_STANDARD_PROJECT_VARIANT_2,
      CardName.MOON_HABITAT_STANDARD_PROJECT_VARIANT_2,
    ],
  ));
  public getStandardProjectDiscount(_player: IPlayer, card: IStandardProjectCard): number {
    if (this.standardProjects.has(card.name)) {
      return 4;
    }
    return 0;
  }
}
