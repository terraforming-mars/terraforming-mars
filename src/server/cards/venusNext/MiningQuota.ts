import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Units} from '../../../common/Units';
import {IProjectCard} from '../IProjectCard';

export class MiningQuota extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MINING_QUOTA,
      cardType: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 5,
      productionBox: Units.of({steel: 2}),

      requirements: CardRequirements.builder((b) => b.tag(Tag.VENUS).tag(Tag.EARTH).tag(Tag.JOVIAN)),
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
