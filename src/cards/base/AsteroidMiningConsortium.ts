import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {GainProduction} from '../../deferredActions/GainProduction';

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
    player.game.defer(new DecreaseAnyProduction(
      player,
      Resources.TITANIUM,
      {count: 1, stealing: true},
    ));
    player.game.defer(new GainProduction(player, Resources.TITANIUM, {count: 1}));
    return undefined;
  }
}
