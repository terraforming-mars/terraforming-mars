import {SpaceBonus} from '../SpaceBonus';
import {SpaceName} from '../SpaceName';
import {Board} from './Board';
import {Player} from '../Player';
import {ISpace} from '../ISpace';
import {BoardBuilder} from './BoardBuilder';

export class OriginalBoard extends Board {
  constructor(shuffleMapOption: boolean = false, seed: number = 0) {
    super();

    const builder = new BoardBuilder(seed);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const TWO_PLANTS = [PLANT, PLANT];

    // y=0
    builder.land(STEEL, STEEL).ocean(STEEL, STEEL).land().ocean(DRAW_CARD).ocean();
    // y=1
    builder.land().land(STEEL).land().land().land().ocean(DRAW_CARD, DRAW_CARD);
    // y=2
    builder.land(DRAW_CARD).land().land().land().land().land().land(STEEL);
    // y=3
    builder.land(PLANT, TITANIUM).land(PLANT).land(PLANT).land(PLANT).land(...TWO_PLANTS).land(PLANT).land(PLANT).ocean(PLANT, PLANT);
    // y=4
    builder.land(...TWO_PLANTS).land(...TWO_PLANTS).land(...TWO_PLANTS).ocean(...TWO_PLANTS).ocean(...TWO_PLANTS)
      .ocean(...TWO_PLANTS).land(...TWO_PLANTS).land(...TWO_PLANTS).land(...TWO_PLANTS);
    // y=5
    builder.land(PLANT).land(...TWO_PLANTS).land(PLANT).land(PLANT).land(PLANT).ocean(PLANT).ocean(PLANT).ocean(PLANT);
    // y=6
    builder.land().land().land().land().land().land(PLANT).land();
    // y=7
    builder.land(STEEL, STEEL).land().land(DRAW_CARD).land(DRAW_CARD).land().land(TITANIUM);
    // y=8
    builder.land(STEEL).land(STEEL, STEEL).land().land().ocean(TITANIUM, TITANIUM);

    if (shuffleMapOption) {
      builder.shuffle(SpaceName.NOCTIS_CITY, SpaceName.THARSIS_THOLUS, SpaceName.ASCRAEUS_MONS, SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS);
    }
    this.spaces = builder.build();
  }
  public getAvailableSpacesOnLand(player: Player): Array<ISpace> {
    return super.getAvailableSpacesOnLand(player).filter((space) => space.id !== SpaceName.NOCTIS_CITY);
  }
  public canPlaceTile(space: ISpace): boolean {
    return super.canPlaceTile(space) && space.id !== SpaceName.NOCTIS_CITY;
  }
}
