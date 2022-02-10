import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';

export class CopernicusSolarArrays extends MoonCard {
  constructor() {
    super({
      name: CardName.COPERNICUS_SOLAR_ARRAYS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.ENERGY, Tags.SPACE],
      cost: 8,
      reserveUnits: Units.of({titanium: 1}),

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

  public override play(player: Player) {
    super.play(player);
    player.heat += 2;
    player.addProduction(Resources.ENERGY, 1, {log: true});
    return undefined;
  }
}
