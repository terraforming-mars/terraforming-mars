import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class PowerSupplyConsortium extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.POWER_SUPPLY_CONSORTIUM,
      tags: [Tags.ENERGY],
      cost: 5,

      metadata: {
        cardNumber: '160',
        requirements: CardRequirements.builder((b) => b.tag(Tags.ENERGY, 2)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).any.br;
            pb.plus().energy(1);
          });
        }),
        description: 'Requires 2 Power tags. Decrease any Energy production 1 step and increase your own 1 step.',
      },
    });
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY);
    game.defer(new DecreaseAnyProduction(player, Resources.ENERGY, 1));
    return undefined;
  }
}
