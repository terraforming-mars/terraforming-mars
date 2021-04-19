
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Farming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FARMING,
      tags: [Tags.PLANT],
      cost: 16,

      requirements: CardRequirements.builder((b) => b.temperature(4)),
      metadata: {
        cardNumber: '118',
        description: 'Requires +4° C or warmer. Increase your M€ production 2 steps and your plant production 2 steps. Gain 2 Plants.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2).br;
            pb.plants(2);
          }).nbsp.plants(2);
        }),
        victoryPoints: 2,
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    player.addProduction(Resources.PLANTS, 2);
    player.plants += 2;
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
