import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class SoilFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOIL_FACTORY,
      tags: [Tags.BUILDING],
      cost: 9,
      productionBox: Units.of({energy: -1, plants: 1}),
      victoryPoints: 1,

      metadata: {
        cardNumber: '179',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().plants(1);
          });
        }),
        description: 'Decrease your Energy production 1 step and increase your Plant production 1 step.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.PLANTS, 1);
    return undefined;
  }
}
