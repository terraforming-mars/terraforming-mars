import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {MarsBoard} from './MarsBoard';
import {SurfaceBuilder} from './SurfaceBuilder';

const PLANT = SpaceBonus.PLANT;
const STEEL = SpaceBonus.STEEL;
const DRAW_CARD = SpaceBonus.DRAW_CARD;
const TITANIUM = SpaceBonus.TITANIUM;

export class ElysiumBoard extends MarsBoard {
  public static readonly TEMPLATE = new SurfaceBuilder()
    // y=0
    .ocean().ocean(TITANIUM).ocean(DRAW_CARD).ocean(STEEL).land(DRAW_CARD)
    // y=1
    .volcanic(TITANIUM).land().land().ocean().ocean().land(STEEL, STEEL)
    // y=2
    .volcanic(TITANIUM, TITANIUM).land().land(DRAW_CARD).land().ocean(PLANT).ocean().volcanic(DRAW_CARD, DRAW_CARD, DRAW_CARD)
    // y=3
    .land(PLANT).land(PLANT).land(PLANT).ocean(PLANT, PLANT).land(PLANT).ocean(PLANT).ocean(PLANT).land(PLANT, STEEL)
    // y=4
    .land(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).volcanic(PLANT, TITANIUM)
    // y=5
    .land(STEEL).land(PLANT).land(PLANT).land(PLANT).land(PLANT).land(PLANT).land(PLANT).land()
    // y=6
    .land(TITANIUM).land(STEEL).land().land().land(STEEL).land().land()
    // y=7
    .land(STEEL, STEEL).land().land().land().land(STEEL, STEEL).land()
    // y=8
    .land(STEEL).land().land(DRAW_CARD).land(DRAW_CARD).land(STEEL, STEEL)
    .build();
}
