import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../../common/boards/SpaceName';
import {Space} from './Space';
import {BoardBuilder} from './BoardBuilder';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';

export class TharsisBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): TharsisBoard {
    const builder = new BoardBuilder(gameOptions, rng);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;

    // y=0
    builder.land(STEEL, STEEL).ocean(STEEL, STEEL).land().ocean(DRAW_CARD).ocean();
    // y=1
    builder.land().volcanic(STEEL).land().land().land().ocean(DRAW_CARD, DRAW_CARD);
    // y=2
    builder.volcanic(DRAW_CARD).land().land().land().land().land().land(STEEL);
    // y=3
    builder.volcanic(PLANT, TITANIUM).land(PLANT).land(PLANT).land(PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT).ocean(PLANT, PLANT);
    // y=4
    builder.volcanic(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).doNotShuffleLastSpace() // Noctis City
      .ocean(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT);
    // y=5
    builder.land(PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT).land(PLANT).ocean(PLANT).ocean(PLANT).ocean(PLANT);
    // y=6
    builder.land().land().land().land().land().land(PLANT).land();
    // y=7
    builder.land(STEEL, STEEL).land().land(DRAW_CARD).land(DRAW_CARD).land().land(TITANIUM);
    // y=8
    builder.land(STEEL).land(STEEL, STEEL).land().land().ocean(TITANIUM, TITANIUM);

    const spaces = builder.build();
    return new TharsisBoard(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces, SpaceName.NOCTIS_CITY, [
      SpaceName.THARSIS_THOLUS,
      SpaceName.ASCRAEUS_MONS,
      SpaceName.PAVONIS_MONS,
      SpaceName.ARSIA_MONS,
    ]);
  }
}
