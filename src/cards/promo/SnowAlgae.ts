import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class SnowAlgae extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SNOW_ALGAE,
      cost: 12,
      tags: [Tags.PLANT],

      requirements: CardRequirements.builder((b) => b.oceans(2)),
      metadata: {
        cardNumber: '211',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(1).heat(1);
          });
        }),
        description: 'Requires 2 oceans. Increase your Plant production and your heat production 1 step each.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    player.addProduction(Resources.HEAT, 1);
    return undefined;
  }
}
