import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {SpaceCosts} from './Board';
import {Space} from './Space';
import {VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST} from '../../common/constants';
import {MarsBoard} from './MarsBoard';
import {SurfaceBuilder} from './SurfaceBuilder';

const PLANT = SpaceBonus.PLANT;
const STEEL = SpaceBonus.STEEL;
const DRAW_CARD = SpaceBonus.DRAW_CARD;
const HEAT = SpaceBonus.HEAT;
const TITANIUM = SpaceBonus.TITANIUM;
const TEMPERATURE = SpaceBonus.TEMPERATURE;

export class VastitasBorealisBoard extends MarsBoard {
  public static readonly TEMPLATE = new SurfaceBuilder()
    // y=0
    .land(STEEL, STEEL).land(PLANT).land().land().volcanic(TITANIUM, TITANIUM)
    // y=1
    .land(STEEL, STEEL).land(STEEL).land().land().volcanic(TITANIUM).land(PLANT)
    // y=2
    .land(TITANIUM).land().land().land().land(DRAW_CARD).ocean(PLANT, DRAW_CARD).ocean(PLANT)
    // y=3
    .volcanic(STEEL, TITANIUM).volcanic(STEEL, DRAW_CARD).land(STEEL).ocean(HEAT, HEAT).ocean(HEAT, HEAT).ocean().ocean(PLANT, PLANT).land(STEEL, PLANT)
    // y=4
    .land().land().land().ocean(HEAT, HEAT).land(TEMPERATURE).doNotShuffleLastSpace().land(STEEL).land().land(PLANT).ocean(TITANIUM)
    // y=5
    .land(PLANT).land().land(PLANT).ocean(HEAT, HEAT).land(HEAT, HEAT).land().land(PLANT).land(TITANIUM, PLANT)
    // y=6
    .land(PLANT, PLANT).land().ocean().land().land(STEEL, PLANT).land(PLANT).land(PLANT, PLANT)
    // y=7
    .ocean(PLANT).land().land(DRAW_CARD).land(STEEL).land().land(PLANT, PLANT)
    // y=8
    .ocean(PLANT, PLANT).land().land(PLANT).land(PLANT, PLANT).land(STEEL, PLANT)
    .build();

  public override spaceCosts(space: Space): SpaceCosts {
    const costs = super.spaceCosts(space);
    if (space.id === SpaceName.VASTITAS_BOREALIS_NORTH_POLE) {
      costs.stock.megacredits = VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST;
      costs.tr.oceans = 1;
    }
    return costs;
  }
}
