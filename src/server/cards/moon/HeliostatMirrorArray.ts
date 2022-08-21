import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';
import {MoonCard} from './MoonCard';

export class HeliostatMirrorArray extends MoonCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tag.ENERGY],
      cardType: CardType.AUTOMATED,
      name: CardName.HELIOSTAT_MIRROR_ARRAY,
      productionBox: Units.of({energy: 2}),
      reserveUnits: Units.of({titanium: 1}),

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

  public override play(player: Player) {
    super.play(player);
    player.heat++;
    return undefined;
  }
}
