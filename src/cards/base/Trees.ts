import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Trees extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TREES,
      tags: [Tags.PLANT],
      cost: 13,

      metadata: {
        cardNumber: '060',
        requirements: CardRequirements.builder((b) => b.temperature(-4)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(3)).plants(1);
        }),
        description: 'Requires -4 C or warmer. Increase your Plant production 3 steps. Gain 1 Plant.',
        victoryPoints: 1,
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 3);
    player.plants++;
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
