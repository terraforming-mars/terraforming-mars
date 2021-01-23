import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class GHGFactories extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GHG_FACTORIES,
      tags: [Tags.BUILDING],
      cost: 11,
      productionBox: Units.of({energy: -1, heat: 4}),

      metadata: {
        cardNumber: '126',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().heat(4).digit;
          });
        }),
        description: 'Decrease your Energy production 1 step and increase your heat production 4 steps.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.HEAT, 4);
    return undefined;
  }
}
