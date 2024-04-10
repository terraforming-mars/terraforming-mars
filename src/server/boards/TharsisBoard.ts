import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {MarsBoard} from './MarsBoard';
import {SurfaceBuilder} from './SurfaceBuilder';

const PLANT = SpaceBonus.PLANT;
const STEEL = SpaceBonus.STEEL;
const DRAW_CARD = SpaceBonus.DRAW_CARD;
const TITANIUM = SpaceBonus.TITANIUM;

export class TharsisBoard extends MarsBoard {
  public static readonly TEMPLATE = new SurfaceBuilder()
  // y=0
    .land(STEEL, STEEL).ocean(STEEL, STEEL).land().ocean(DRAW_CARD).ocean()
  // y=1
    .land().volcanic(STEEL).land().land().land().ocean(DRAW_CARD, DRAW_CARD)
  // y=2
    .volcanic(DRAW_CARD).land().land().land().land().land().land(STEEL)
  // y=3
    .volcanic(PLANT, TITANIUM).land(PLANT).land(PLANT).land(PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT).ocean(PLANT, PLANT)
  // y=4
    .volcanic(PLANT, PLANT).land(PLANT, PLANT).noctisCity(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT)
    .ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT)
  // y=5
    .land(PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT).land(PLANT).ocean(PLANT).ocean(PLANT).ocean(PLANT)
  // y=6
    .land().land().land().land().land().land(PLANT).land()
  // y=7
    .land(STEEL, STEEL).land().land(DRAW_CARD).land(DRAW_CARD).land().land(TITANIUM)
  // y=8
    .land(STEEL).land(STEEL, STEEL).land().land().ocean(TITANIUM, TITANIUM)
    .build();
}
