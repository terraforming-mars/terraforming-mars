import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class HeliostatMirrorArray extends Card {
  constructor() {
    super({
      cost: 10,
      tags: [Tag.ENERGY],
      cardType: CardType.AUTOMATED,
      name: CardName.HELIOSTAT_MIRROR_ARRAY,
      productionBox: {energy: 2},
      reserveUnits: {titanium: 1},

      metadata: {
        description: 'Spend 1 titanium. Gain 1 heat. Increase your energy production 2 steps.',
        cardNumber: 'M41',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).heat(1);
          b.br;
          b.production((pb) => pb.energy(2));
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.heat++;
    return undefined;
  }
}
