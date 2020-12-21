import {SpaceBonus} from '../SpaceBonus';
import {SpaceName} from '../SpaceName';
import {Board} from './Board';
import {BoardBuilder} from './BoardBuilder';
import {RandomBoardOptionType} from './RandomBoardOptionType';

export class ElysiumBoard extends Board {
  constructor(randomBoardOption: RandomBoardOptionType = RandomBoardOptionType.NONE, seed: number = 0) {
    super();
    const builder = new BoardBuilder(randomBoardOption, seed);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;

    // y=0
    builder.ocean().ocean(TITANIUM).ocean(DRAW_CARD).ocean(STEEL).land(DRAW_CARD);
    // y=1
    builder.land(TITANIUM).land().land().ocean().ocean().land(STEEL, STEEL);
    // y=2
    builder.land(TITANIUM, TITANIUM).land().land(DRAW_CARD).land().ocean(PLANT).ocean().land(DRAW_CARD, DRAW_CARD, DRAW_CARD);
    // y=3
    builder.land(PLANT).land(PLANT).land(PLANT).ocean(PLANT, PLANT).land(PLANT).ocean(PLANT).ocean(PLANT).land(PLANT, STEEL);
    // y=4
    builder.land(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, TITANIUM);
    // y=5
    builder.land(STEEL).land(PLANT).land(PLANT).land(PLANT).land(PLANT).land(PLANT).land(PLANT).land();
    // y=6
    builder.land(TITANIUM).land(STEEL).land().land().land(STEEL).land().land();
    // y=7
    builder.land(STEEL, STEEL).land().land().land().land(STEEL, STEEL).land();
    // y=8
    builder.land(STEEL).land().land(DRAW_CARD).land(DRAW_CARD).land(STEEL, STEEL);

    builder.setMustBeLandSpaces(SpaceName.HECATES_THOLUS, SpaceName.ELYSIUM_MONS, SpaceName.ARSIA_MONS_ELYSIUM, SpaceName.OLYMPUS_MONS);
    this.spaces = builder.build();
  }
}
