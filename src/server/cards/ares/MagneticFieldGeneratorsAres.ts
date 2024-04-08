import {CardName} from '../../../common/cards/CardName';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {MagneticFieldGeneratorsPromo} from '../promo/MagneticFieldGeneratorsPromo';

export class MagneticFieldGeneratorsAres extends MagneticFieldGeneratorsPromo {
  constructor() {
    super(
      CardName.MAGNETIC_FIELD_GENERATORS_ARES,
      {bonus: [SpaceBonus.PLANT, SpaceBonus.MICROBE]},
      {
        cardNumber: 'Axx',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(4, {digit}).br;
            pb.plus().plants(2);
          }).br;
          b.tr(3, {digit});
          b.tile(TileType.MAGNETIC_FIELD_GENERATORS, false, true).asterix().br;
        }),
        description: 'Decrease your energy production 4 steps and increase your plant production 2 steps. Raise your TR 3 steps. Place this tile. It provides adjacency bonus of 1 plant and 1 microbe.',
      });
  }
}
