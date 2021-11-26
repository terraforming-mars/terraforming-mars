import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';

export class BiomassCombustors extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BIOMASS_COMBUSTORS,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 4,
      victoryPoints: -1,

      requirements: CardRequirements.builder((b) => b.oxygen(6)),
      metadata: {
        description: 'Requires 6% oxygen. Decrease any Plant production 1 step and increase your Energy production 2 steps.',
        cardNumber: '183',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().plants(-1, {all}).br;
            pb.plus().energy(2);
          });
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.game.someoneHasResourceProduction(Resources.PLANTS, 1);
  }

  public play(player: Player) {
    this.produce(player);
    return undefined;
  }

  public produce(player: Player) {
    player.addProduction(Resources.ENERGY, 2);
    player.game.defer(
      new DecreaseAnyProduction(player, Resources.PLANTS, {count: 1}));
  }
}
