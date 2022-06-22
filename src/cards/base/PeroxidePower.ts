import {Tags} from '../../common/cards/Tags';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class PeroxidePower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PEROXIDE_POWER,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 7,
      productionBox: Units.of({energy: 2, megacredits: -1}),

      metadata: {
        cardNumber: '089',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(1).br;
            pb.plus().energy(2);
          });
        }),
        description: 'Decrease your M€ production 1 step and increase your Energy production 2 steps.',
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -4;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -1);
    player.addProduction(Resources.ENERGY, 2);
    return undefined;
  }
}
