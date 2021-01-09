import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class NuclearPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NUCLEAR_POWER,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 10,
      hasRequirements: false,

      metadata: {
        cardNumber: '045',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().energy(3);
          });
        }),
        description: 'Decrease your MC production 2 steps and increase your Energy production 3 steps.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -3;
  }
  public play(player: Player, _game: Game) {
    if (player.getProduction(Resources.MEGACREDITS) < -3) {
      throw 'Not enough mega credit production';
    }
    player.addProduction(Resources.MEGACREDITS, -2);
    player.addProduction(Resources.ENERGY, 3);
    return undefined;
  }
}
