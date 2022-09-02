import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class LightningHarvest extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LIGHTNING_HARVEST,
      cost: 8,
      tags: [Tag.ENERGY],
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 3)),
      metadata: {
        cardNumber: '046',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).megacredits(1));
        }),
        description: 'Requires 3 Science tags. Increase your Energy production and your M€ production one step each.',
      },
    });
  }

  public play(player: Player) {
    player.production.add(Resources.ENERGY, 1);
    player.production.add(Resources.MEGACREDITS, 1);
    return undefined;
  }
}
