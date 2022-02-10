
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Bushes extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BUSHES,
      tags: [Tags.PLANT],
      cost: 10,

      requirements: CardRequirements.builder((b) => b.temperature(-10)),
      metadata: {
        cardNumber: '093',
        description: 'Requires -10 C or warmer. Increase your plant production 2 steps. Gain 2 plants.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(2);
          }).plants(2);
        }),
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 2);
    player.plants += 2;
    return undefined;
  }
}
