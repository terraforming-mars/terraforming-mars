import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class NuclearPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NUCLEAR_POWER,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 10,
      productionBox: Units.of({energy: 3, megacredits: -2}),

      metadata: {
        cardNumber: '045',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().energy(3);
          });
        }),
        description: 'Decrease your M€ production 2 steps and increase your Energy production 3 steps.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -3;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -2);
    player.addProduction(Resources.ENERGY, 3);
    return undefined;
  }
}
