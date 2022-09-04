import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class CopernicusSolarArrays extends Card {
  constructor() {
    super({
      name: CardName.COPERNICUS_SOLAR_ARRAYS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.ENERGY, Tag.SPACE],
      cost: 8,
      reserveUnits: {titanium: 1},

      metadata: {
        description: 'Spend 1 titanium. Gain 2 heat. Incease your energy production 1 step.',
        cardNumber: 'M44',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1);
          b.br;
          b.heat(2);
          b.br;
          b.production((pb) => pb.energy(1));
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.heat += 2;
    player.production.add(Resources.ENERGY, 1, {log: true});
    return undefined;
  }
}
