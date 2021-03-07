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
      requirements: CardRequirements.builder((b) => b.miningTiles(1).any()),

      metadata: {
        description: 'Effect: When you pay for a luna standard project (colony, road, mine), you spend 4MC less. / Requires 1 mine on the Moon.',
        cardNumber: 'M38',
        renderData: CardRenderer.builder((_b) => {}),
      },
    });
  };

  public play() {
    return undefined;
  }
}
