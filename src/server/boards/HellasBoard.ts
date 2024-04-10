import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {SpaceCosts} from './Board';
import {Space} from './Space';
import {HELLAS_BONUS_OCEAN_COST} from '../../common/constants';
import {MarsBoard} from './MarsBoard';
import {SurfaceBuilder} from './SurfaceBuilder';

const PLANT = SpaceBonus.PLANT;
const STEEL = SpaceBonus.STEEL;
const DRAW_CARD = SpaceBonus.DRAW_CARD;
const HEAT = SpaceBonus.HEAT;
const TITANIUM = SpaceBonus.TITANIUM;

export class HellasBoard extends MarsBoard {
  public static readonly TEMPLATE = new SurfaceBuilder()
    // y=0
    .ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, STEEL).land(PLANT)
    // y=1
    .ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT, STEEL).land(PLANT).land(PLANT)
    // y=2
    .ocean(PLANT).land(PLANT).land(STEEL).land(STEEL).land().land(PLANT, PLANT).land(PLANT, DRAW_CARD)
    // y=3
    .ocean(PLANT).land(PLANT).land(STEEL).land(STEEL, STEEL).land(STEEL).ocean(PLANT).ocean(PLANT).land(PLANT)
    // y=4
    .land(DRAW_CARD).land().land().land(STEEL, STEEL).land().ocean(DRAW_CARD).ocean(HEAT, HEAT, HEAT).ocean().land(PLANT)
    // y=5
    .land(TITANIUM).land().land(STEEL).land().land().ocean().ocean(STEEL).land()
    // y=6
    .ocean(TITANIUM, TITANIUM).land().land().land(DRAW_CARD).land().land().land(TITANIUM)
    // y=7
    .land(STEEL).land(DRAW_CARD).land(HEAT, HEAT).land(HEAT, HEAT).land(TITANIUM).land(TITANIUM)
    // y=8
    .land().land(HEAT, HEAT).land(SpaceBonus.OCEAN).doNotShuffleLastSpace().land(HEAT, HEAT).land()
    .build();

  public override spaceCosts(space: Space): SpaceCosts {
    const costs = super.spaceCosts(space);
    if (space.id === SpaceName.HELLAS_OCEAN_TILE) {
      costs.stock.megacredits = HELLAS_BONUS_OCEAN_COST;
      costs.tr.oceans = 1;
    }
    return costs;
  }
}
