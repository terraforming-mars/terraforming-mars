import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {MoonCard} from './MoonCard';

export class TitaniumExtractionCenter extends MoonCard {
  constructor() {
    super({
      name: CardName.TITANIUM_EXTRACTION_CENTER,
      cardType: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 14,
      reserveUnits: {titanium: 2},

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
    player.production.add(Resources.TITANIUM, productionIncrease, {log: true});
  }

  public play(player: Player) {
    this.produce(player);
    return undefined;
  }
}
