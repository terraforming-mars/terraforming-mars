import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Units} from '../../Units';

export class MartianDustProcessingPlant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MARTIAN_DUST_PROCESSING_PLANT,
      cost: 15,
      tags: [Tags.MARS, Tags.BUILDING],
      productionBox: Units.of({energy: -1, steel: 2}),
      tr: {tr: 1},
      victoryPoints: 1,

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

  public override canPlay(player: Player) {
    return player.canAdjustProduction(this.productionBox);
  }

  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.increaseTerraformRating();
    return undefined;
  }
}

