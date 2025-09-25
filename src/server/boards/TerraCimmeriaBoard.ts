import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BoardBuilder} from './BoardBuilder';
import {SpaceName} from '../../common/boards/SpaceName';
import {Random} from '../../common/utils/Random';
import {Space} from './Space';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';

export class TerraCimmeriaBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): TerraCimmeriaBoard {
    const builder = new BoardBuilder(gameOptions);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const ENERGY = SpaceBonus.ENERGY;

    // y=0
    builder.ocean().land(PLANT).land(STEEL).land(PLANT, PLANT).ocean(PLANT, PLANT);
    // y=1
    builder.ocean(TITANIUM, TITANIUM).land().land().land(PLANT).land(PLANT, STEEL).ocean(PLANT);
    // y=2
    builder.land().land(PLANT).land(ENERGY, ENERGY, ENERGY).land().land(PLANT).land(PLANT).land(PLANT);
    // y=3
    builder.land(STEEL, STEEL).land(PLANT, PLANT).land().land(ENERGY, ENERGY).land().land().land(DRAW_CARD).land();
    // y=4
    builder.land().land(PLANT, ENERGY).land(ENERGY, ENERGY).land(STEEL).land(STEEL)
      .land(DRAW_CARD).land().land(STEEL).ocean(DRAW_CARD);
    // y=5
    builder.land(DRAW_CARD, DRAW_CARD).land().land(TITANIUM).land().land().land(STEEL, STEEL).land().land(STEEL, STEEL);
    // y=6
    builder.land().land(TITANIUM).land(PLANT).land(PLANT, STEEL, STEEL).land(PLANT, PLANT).land(PLANT).ocean(PLANT, PLANT);
    // y=7
    builder.ocean(STEEL, STEEL).land(PLANT).land(TITANIUM).land(DRAW_CARD).land(PLANT).ocean(PLANT);
    // y=8
    builder.ocean(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(PLANT).ocean(PLANT, PLANT);

    if (gameOptions.shuffleMapOption) {
      builder.shuffle(rng,
        SpaceName.ALBOR_THOLUS_TERRACIMMERIA,
        SpaceName.APOLLINARIS_MONS,
        SpaceName.HADRIACUS_MONS,
        SpaceName.TYRRHENUS_MONS);
    }

    const spaces = builder.build();
    return new TerraCimmeriaBoard(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces, undefined, [
      SpaceName.ALBOR_THOLUS_TERRACIMMERIA,
      SpaceName.APOLLINARIS_MONS,
      SpaceName.HADRIACUS_MONS,
      SpaceName.TYRRHENUS_MONS,
    ]);
  }
}
