import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {MarsBoard} from './MarsBoard';
import {SurfaceBuilder} from './SurfaceBuilder';

const PLANT = SpaceBonus.PLANT;
const STEEL = SpaceBonus.STEEL;
const DRAW_CARD = SpaceBonus.DRAW_CARD;
const TITANIUM = SpaceBonus.TITANIUM;
const MICROBE = SpaceBonus.MICROBE;
const ANIMAL = SpaceBonus.ANIMAL;
const HEAT = SpaceBonus.HEAT;

export class AmazonisBoard extends MarsBoard {
  public static readonly TEMPLATE = new SurfaceBuilder()
    // y=0
    .land().ocean(PLANT).land(PLANT, PLANT, PLANT).land(MICROBE).land(ANIMAL)
    // y=1
    .ocean(TITANIUM).land(MICROBE, MICROBE).land().land().ocean(DRAW_CARD, DRAW_CARD).ocean()
    // y=2
    .land(PLANT, PLANT).land(STEEL, PLANT).land(STEEL, HEAT).land(HEAT, PLANT).land(ANIMAL).land().land(MICROBE)
    // y=3
    .land().ocean(PLANT).land().land(PLANT).land(HEAT, PLANT).land(STEEL).land(PLANT).ocean(STEEL, PLANT)
    // y=4
    .land(PLANT).land(PLANT).land().land(HEAT, HEAT).restricted().doNotShuffleLastSpace()
    .land(HEAT, HEAT).land(PLANT, PLANT).land().land(TITANIUM, TITANIUM)
    // y=5
    .ocean(PLANT, PLANT).land(PLANT).land(STEEL).land(HEAT, PLANT).land(PLANT).land(DRAW_CARD).land().ocean(PLANT)
    // y=6
    .ocean(PLANT).land().land(MICROBE).land(HEAT, PLANT).land().land(PLANT, PLANT).ocean(PLANT, PLANT)
    // y=7
    .land(TITANIUM).ocean(PLANT).land(STEEL).land().land(ANIMAL).land(PLANT)
    // y=8
    .land().land(DRAW_CARD).land(STEEL).ocean(PLANT).land(STEEL, STEEL)
    .build();
}
