import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';

export class MooncrateBlockFactory extends Card {
  constructor() {
    super({
      name: CardName.MOONCRATE_BLOCK_FACTORY,
      cardType: CardType.ACTIVE,
      tags: [Tags.BUILDING],
      cost: 8,
      requirements: CardRequirements.builder((b) => b.miningTiles(1)),

      metadata: {
        description: 'Requires 1 mine on the Moon.',
        cardNumber: 'M38',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you pay for a Lunar standard project, you spend 4M€ less.', (eb) => {
            eb.plate('Lunar standard projects').startEffect.megacredits(-4);
          });
        }),
      },
    });
  };

  public play() {
    // Behavior is in MoonColonyStandardProject, MoonMineStandardProject and MoonRoadStandardProject.
    return undefined;
  }
}
