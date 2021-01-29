import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class DeepLunarMining extends MoonCard {
  constructor() {
    super({
      name: CardName.DEEP_LUNAR_MINING,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 18,
      productionBox: Units.of({titanium: 2}),

      metadata: {
        description: 'Spend 1 titanium. Increase your titanium production 2 steps. Raise the Mining Rate 1 step.',
        cardNumber: 'M18',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).production((pb) => {
            pb.titanium(2);
          }).br;
          b.moonMineRate(1);
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 1}),
    });
  };

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    Units.adjustProduction(this.productionBox, player, player.game);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
