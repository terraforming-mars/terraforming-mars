import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class IronExtractionCenter extends MoonCard {
  constructor() {
    super({
      name: CardName.IRON_EXTRACTION_CENTER,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 10,
      productionBox: Units.of({}),

      metadata: {
        description: 'Spend 1 titanium. Increase your steel production 1 step for every 2 raised steps of mining rate.',
        cardNumber: 'M25',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.production((pb) => pb.steel(1)).slash().moonMiningRate({amount: 2});
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 1}),
    });
  }


  public play(player: Player) {
    super.play(player);
    const miningRate = MoonExpansion.moonData(player.game).miningRate;
    const productionIncrease = Math.floor(miningRate / 2);
    player.addProduction(Resources.STEEL, productionIncrease);
    return undefined;
  }
}
