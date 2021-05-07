import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidMiningConsortium extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ASTEROID_MINING_CONSORTIUM,
      tags: [Tags.JOVIAN],
      cost: 13,

      requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM)),
      metadata: {
        description: 'Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.',
        cardNumber: '002',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().titanium(-1).any.br;
            pb.plus().titanium(1);
          });
        }),
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new DecreaseAnyProduction(player, Resources.TITANIUM, 1));
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
