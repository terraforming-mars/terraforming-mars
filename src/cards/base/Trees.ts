import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Trees extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TREES,
      tags: [Tags.PLANT],
      cost: 13,
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.temperature(-4)),
      metadata: {
        cardNumber: '060',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(3)).plants(1);
        }),
        description: 'Requires -4 C or warmer. Increase your Plant production 3 steps. Gain 1 Plant.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 3);
    player.plants++;
    return undefined;
  }
}
