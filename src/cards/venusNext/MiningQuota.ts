import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Units} from '../../common/Units';

export class MiningQuota extends Card {
  constructor() {
    super({
      name: CardName.MINING_QUOTA,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 5,
      productionBox: Units.of({steel: 2}),

      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH).tag(Tags.JOVIAN)),
      metadata: {
        cardNumber: '239',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(2));
        }),
        description: 'Requires Venus, Earth and Jovian tags. Increase your steel production 2 steps.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 2);
    return undefined;
  }
}
