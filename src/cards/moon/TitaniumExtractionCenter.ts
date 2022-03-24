import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';

export class TitaniumExtractionCenter extends MoonCard {
  constructor() {
    super({
      name: CardName.TITANIUM_EXTRACTION_CENTER,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 14,
      reserveUnits: Units.of({titanium: 2}),

      metadata: {
        description: 'Spend 2 titanium. Increase your titanium production 1 step for every 2 raised steps of Mining Rate.',
        cardNumber: 'M26',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).br;
          b.production((pb) => pb.titanium(1)).slash().moonMiningRate({amount: 2});
        }),
      },
    });
  }

  public produce(player: Player) {
    const miningRate = MoonExpansion.moonData(player.game).miningRate;
    const productionIncrease = Math.floor(miningRate / 2);
    player.addProduction(Resources.TITANIUM, productionIncrease, {log: true});
  }

  public override play(player: Player) {
    super.play(player);
    this.produce(player);
    return undefined;
  }
}
