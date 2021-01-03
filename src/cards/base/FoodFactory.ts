import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class FoodFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FOOD_FACTORY,
      tags: [Tags.BUILDING],
      cost: 12,
      hasRequirements: false,

      metadata: {
        cardNumber: '041',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => {
            pb.minus().plants(1).br;
            pb.plus().megacredits(4);
          });
        }),
        description: 'Decrease your Plant production 1 step and increase your MC production 4 steps',
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.PLANTS) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, -1);
    player.addProduction(Resources.MEGACREDITS, 4);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
