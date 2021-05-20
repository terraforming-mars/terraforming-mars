import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';

export class HeatTrappers extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HEAT_TRAPPERS,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 6,

      metadata: {
        cardNumber: '178',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().heat(2).any.br;
            pb.plus().energy(1);
          });
        }),
        description: 'Decrease any heat production 2 steps and increase your Energy production 1 step.',
        victoryPoints: -1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.game.someoneHasResourceProduction(Resources.HEAT, 2);
  }

  public produce(player: Player) {
    player.game.defer(new DecreaseAnyProduction(player, Resources.HEAT, 2));
    player.addProduction(Resources.ENERGY, 1);
  }

  public play(player: Player) {
    this.produce(player);
    return undefined;
  }
  public getVictoryPoints() {
    return -1;
  }
}
