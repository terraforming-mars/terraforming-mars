
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class CarbonateProcessing extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CARBONATE_PROCESSING,
      tags: [Tags.BUILDING],
      cost: 6,
      productionBox: Units.of({energy: -1, heat: 3}),

      metadata: {
        cardNumber: '043',
        description: 'Decrease your Energy production 1 step and increase your heat production 3 steps.',
        renderData: CardRenderer.builder((b) => b.production((pb) => {
          pb.minus().energy(1).br;
          pb.plus().heat(3);
        })),
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.HEAT, 3);
    return undefined;
  }
}
