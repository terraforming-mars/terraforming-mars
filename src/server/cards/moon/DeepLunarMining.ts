import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class DeepLunarMining extends Card {
  constructor() {
    super({
      name: CardName.DEEP_LUNAR_MINING,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON],
      cost: 18,
      productionBox: {titanium: 2},
      reserveUnits: {titanium: 1},
      tr: {moonMining: 1},

      metadata: {
        description: 'Spend 1 titanium. Increase your titanium production 2 steps. Raise the Mining Rate 1 step.',
        cardNumber: 'M18',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).production((pb) => {
            pb.titanium(2);
          }).br;
          b.moonMiningRate();
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
