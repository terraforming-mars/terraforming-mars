import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class BiomassCombustors extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BIOMASS_COMBUSTORS,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 4,

      metadata: {
        description: 'Requires 6% oxygen. Decrease any Plant production 1 step and increase your Energy production 2 steps.',
        cardNumber: '183',
        requirements: CardRequirements.builder((b) => b.oxygen(6)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().plants(-1).any.br;
            pb.energy(2);
          });
        }),
        victoryPoints: -1,
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    return super.canPlay(player) && game.someoneHasResourceProduction(Resources.PLANTS, 1);
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY, 2);
    game.defer(new DecreaseAnyProduction(player, Resources.PLANTS, 1));
    return undefined;
  }
  public getVictoryPoints() {
    return -1;
  }
}
