import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {MarsBoard} from './MarsBoard';
import {SurfaceBuilder} from './SurfaceBuilder';

const PLANT = SpaceBonus.PLANT;
const STEEL = SpaceBonus.STEEL;
const DRAW_CARD = SpaceBonus.DRAW_CARD;
const TITANIUM = SpaceBonus.TITANIUM;
const ENERGY = SpaceBonus.ENERGY;

export class TerraCimmeriaBoard extends MarsBoard {
  public static readonly TEMPLATE = new SurfaceBuilder()
    // y=0
    .ocean().land(PLANT).land(STEEL).land(PLANT, PLANT).ocean(PLANT, PLANT)
    // y=1
    .ocean(TITANIUM, TITANIUM).land().land().land(PLANT).land(PLANT, STEEL).ocean(PLANT)
    // y=2
    .land().land(PLANT).land(ENERGY, ENERGY, ENERGY).land().land(PLANT).land(PLANT).land(PLANT)
    // y=3
    .land(STEEL, STEEL).land(PLANT, PLANT).land().land(ENERGY, ENERGY).land().land().land(DRAW_CARD).land()
    // y=4
    .land().land(PLANT, ENERGY).land(ENERGY, ENERGY).land(STEEL).land(STEEL)
    .land(DRAW_CARD).land().land(STEEL).ocean(DRAW_CARD)
    // y=5
    .land(DRAW_CARD, DRAW_CARD).land().land(TITANIUM).land().land().land(STEEL, STEEL).land().land(STEEL, STEEL)
    // y=6
    .land().land(TITANIUM).land(PLANT).land(PLANT, STEEL, STEEL).land(PLANT, PLANT).land(PLANT).ocean(PLANT, PLANT)
    // y=7
    .ocean(STEEL, STEEL).land(PLANT).land(TITANIUM).land(DRAW_CARD).land(PLANT).ocean(PLANT)
    // y=8
    .ocean(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(PLANT).ocean(PLANT, PLANT)
    .build();
}
