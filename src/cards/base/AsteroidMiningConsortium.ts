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
import {all} from '../Options';

export class AsteroidMiningConsortium extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ASTEROID_MINING_CONSORTIUM,
      tags: [Tags.JOVIAN],
      cost: 13,
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM)),
      metadata: {
        description: 'Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.',
        cardNumber: '002',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().titanium(-1, {all}).br;
            pb.plus().titanium(1);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    const decreaseAction = new DecreaseAnyProduction(
      player,
      Resources.TITANIUM,
      {count: 1, stealing: true},
    );
    player.game.defer(decreaseAction);
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
  }
}
