import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
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

  public canPlay(_player: Player, game: Game): boolean {
    return game.someoneHasResourceProduction(Resources.HEAT, 2);
  }

  public play(player: Player, game: Game) {
    game.defer(new DecreaseAnyProduction(player, Resources.HEAT, 2));
    player.addProduction(Resources.ENERGY);
    return undefined;
  }
  public getVictoryPoints() {
    return -1;
  }
}
