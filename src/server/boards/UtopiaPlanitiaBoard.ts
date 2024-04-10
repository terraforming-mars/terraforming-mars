import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {MarsBoard} from './MarsBoard';
import {SurfaceBuilder} from './SurfaceBuilder';

const PLANT = SpaceBonus.PLANT;
const STEEL = SpaceBonus.STEEL;
const ENERGY = SpaceBonus.ENERGY;
const DRAW_CARD = SpaceBonus.DRAW_CARD;
const TITANIUM = SpaceBonus.TITANIUM;

export class UtopiaPlanitiaBoard extends MarsBoard {
  public static readonly TEMPLATE = new SurfaceBuilder()
    // y=0
    .land().land().land(ENERGY, ENERGY).land().land()
    // y=1
    .land().land(STEEL, STEEL).land(ENERGY, ENERGY).land(ENERGY, ENERGY, DRAW_CARD).land().land()
    // y=2
    .ocean(PLANT, PLANT, PLANT).land().land(STEEL).land().land().land(DRAW_CARD, DRAW_CARD, TITANIUM).land(TITANIUM, TITANIUM)
    // y=3
    .ocean(PLANT, DRAW_CARD).land(PLANT).land(PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT).ocean(PLANT).land(PLANT)
    // y=4
    .land().land().land().land(PLANT).land(PLANT).land(PLANT, PLANT).land().ocean().land(PLANT, TITANIUM)
    // y=5
    .land(STEEL).land(STEEL, STEEL).ocean(PLANT, PLANT).land(PLANT, PLANT).land().land().land(STEEL, STEEL).land()
    // y=6
    .land(STEEL).land().ocean().ocean(PLANT, PLANT).land().land().land()
    // y=7
    .land().land(DRAW_CARD, DRAW_CARD).ocean().ocean(PLANT, PLANT).land(STEEL, TITANIUM).land(PLANT, PLANT)
    // y=8
    .land().land().land(STEEL, STEEL).ocean(PLANT).land(PLANT)
    .build();
}
