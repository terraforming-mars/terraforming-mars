import {GameOptions} from '../game/GameOptions';
import {Random} from '../../common/utils/Random';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {BoardBuilder} from './BoardBuilder';
import {Space} from './Space';
import {MarsBoard} from './MarsBoard';

export class Hollandia extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): Hollandia {
    const builder = new BoardBuilder(gameOptions);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const HEAT = SpaceBonus.HEAT;

    // y=0
    builder.ocean(STEEL).land(PLANT, PLANT).land(DRAW_CARD).ocean(TITANIUM).deflectionZone(PLANT);
    // y=1
    builder.ocean(PLANT, PLANT).land(PLANT, PLANT).land().land(STEEL).deflectionZone().deflectionZone();
    // y=2
    builder.land(DRAW_CARD).ocean(PLANT).land(STEEL, PLANT).land().deflectionZone(PLANT, PLANT).deflectionZone().deflectionZone(DRAW_CARD);
    // y=3
    builder.land(STEEL, STEEL, STEEL).land(PLANT).ocean().land(STEEL, PLANT).land().deflectionZone(TITANIUM).deflectionZone().deflectionZone(STEEL);
    // y=4
    builder.land(TITANIUM).land().land(PLANT).ocean(PLANT, PLANT).land().land().deflectionZone().deflectionZone(PLANT).deflectionZone();
    // y=5
    builder.land(STEEL, PLANT).land().land().land(PLANT, STEEL).land().land().land(PLANT, PLANT).ocean(TITANIUM, TITANIUM);
    // y=6
    builder.ocean(PLANT, PLANT).land().land().land(HEAT, HEAT).land(HEAT, HEAT, HEAT).land(PLANT).ocean(PLANT);
    // y=7
    builder.ocean().ocean(PLANT, PLANT).land(PLANT, PLANT).land(HEAT, HEAT).land(TITANIUM, PLANT).ocean(PLANT);
    // y=8
    builder.land(DRAW_CARD, DRAW_CARD).land(PLANT, PLANT).land().land().land(DRAW_CARD);

    if (gameOptions.shuffleMapOption) {
      // TODO(kberg): This only shuffles the spaces outside the zone. The spaces inside the zone could be shuffled too.
      builder.shuffle(rng);
    }

    const spaces = builder.build();
    return new Hollandia(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces, undefined, []);
  }

  public override getSpaces(spaceType: SpaceType): Array<Space> {
    switch (spaceType) {
    case SpaceType.LAND:
      return this.spaces.filter((space) => space.spaceType === spaceType || space.spaceType === SpaceType.DEFLECTION_ZONE);
    default:
      return this.spaces.filter((space) => space.spaceType === spaceType);
    }
  }
}
