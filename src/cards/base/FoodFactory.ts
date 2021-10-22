import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class FoodFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FOOD_FACTORY,
      tags: [Tags.BUILDING],
      cost: 12,
      productionBox: Units.of({megacredits: 4, plants: -1}),
      victoryPoints: 1,

      metadata: {
        cardNumber: '041',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().plants(1).br;
            pb.plus().megacredits(4);
          });
        }),
        description: 'Decrease your Plant production 1 step and increase your M€ production 4 steps',
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
}
