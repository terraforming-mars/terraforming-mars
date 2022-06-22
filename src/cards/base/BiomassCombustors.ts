import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';
import {GainProduction} from '../../deferredActions/GainProduction';

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

  public override canPlay(player: Player): boolean {
    return player.canReduceAnyProduction(Resources.PLANTS, 1);
  }

  public play(player: Player) {
    this.produce(player);
    return undefined;
  }

  public produce(player: Player) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resources.PLANTS, {count: 1}));
    player.game.defer(new GainProduction(player, Resources.ENERGY, {count: 2}));
  }
}
