import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class HeatTrappers extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HEAT_TRAPPERS,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 6,
      victoryPoints: -1,

      metadata: {
        cardNumber: '178',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().heat(2, {all}).br;
            pb.plus().energy(1);
          });
        }),
        description: 'Decrease any heat production 2 steps and increase your Energy production 1 step.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.canReduceAnyProduction(Resources.HEAT, 2);
  }

  public produce(player: Player) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resources.HEAT, {count: 2}));
    player.production.add(Resources.ENERGY, 1);
  }

  public play(player: Player) {
    this.produce(player);
    return undefined;
  }
}
