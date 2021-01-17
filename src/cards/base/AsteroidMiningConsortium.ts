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

export class AsteroidMiningConsortium extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ASTEROID_MINING_CONSORTIUM,
      tags: [Tags.JOVIAN],
      cost: 13,

      metadata: {
        description: 'Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.',
        cardNumber: '002',
        requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM)),
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
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.TITANIUM) >= 1;
  }
  public play(player: Player, game: Game) {
    game.defer(new DecreaseAnyProduction(player, Resources.TITANIUM, 1));
    player.addProduction(Resources.TITANIUM);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
