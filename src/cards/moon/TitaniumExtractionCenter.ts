import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class TitaniumExtractionCenter extends MoonCard {
  constructor() {
    super({
      name: CardName.TITANIUM_EXTRACTION_CENTER,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 14,
      productionBox: Units.of({}),

      metadata: {
        description: 'Spend 2 titanium. Increase your titanium production 1 step for every 2 raised steps of Mining Rate.',
        cardNumber: 'M26',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).br;
          b.production((pb) => pb.titanium(1)).slash().moonMiningRate(2);
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 2}),
    });
  }

  public play(player: Player) {
    super.play(player);
    const miningRate = MoonExpansion.moonData(player.game).miningRate;
    const productionIncrease = Math.floor(miningRate / 2);
    player.addProduction(Resources.TITANIUM, productionIncrease);
    return undefined;
  }
}
