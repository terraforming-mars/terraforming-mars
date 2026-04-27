import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {Units} from '../../../common/Units';
import {AdjustProduction} from '../../deferredActions/AdjustProduction';

export class MartianDustProcessingPlant extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MARTIAN_DUST_PROCESSING_PLANT,
      cost: 15,
      tags: [Tag.MARS, Tag.BUILDING],

      behavior: {
        tr: 1,
      },

      metadata: {
        cardNumber: 'Pf44',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1).nbsp.steel(2)).br;
          b.tr(1);
        }),
        description: 'Decrease your energy production 1 step, and raise your steel production 2 steps. Gain 1 TR.',
      },
    });
  }

  public productionBox() {
    return Units.of({energy: -1, steel: 2});
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    // A Mars-track advance can grant +1 energy production, which offsets the cost.
    return player.production.energy >= 1 || PathfindersExpansion.willGainEnergyProductionOnNextMarsTag(player);
  }

  public override bespokePlay(player: IPlayer) {
    // Deferred in case the energy production gain comes from the Planetary track.
    player.game.defer(new AdjustProduction(player, this.productionBox()));
    return undefined;
  }
}
