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

export class EnergyTapping extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ENERGY_TAPPING,
      tags: [Tags.ENERGY],
      cost: 3,
      hasRequirements: false,

      metadata: {
        cardNumber: '201',
        description: 'Decrease any Energy production 1 step and increase your own 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => {
            pb.minus().energy(1).any.br;
            pb.plus().energy(1);
          });
        }),
        victoryPoints: -1,
      },
    });
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY);
    game.defer(new DecreaseAnyProduction(player, game, Resources.ENERGY, 1));
    return undefined;
  }

  public getVictoryPoints() {
    return -1;
  }
}
