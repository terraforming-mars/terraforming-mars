import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BoardBuilder} from './BoardBuilder';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';
import {Space} from './Space';

const TILES_PER_ROW = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6];
const MAX_OCEANS = 11;
const MAX_TEMPERATURE = 14;
const MAX_OXYGEN = 18;
const MAX_VENUS = 36; // Displayed as 33%; see venusScaleLevelForDisplay.

export class AmazonisPlanitiaBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): AmazonisPlanitiaBoard {
    const builder = new BoardBuilder(gameOptions, rng, TILES_PER_ROW);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const ENERGY = SpaceBonus.ENERGY;
    const DELEGATE = SpaceBonus.DELEGATE;
    const STANDARD_RESOURCE = SpaceBonus.STANDARD_RESOURCE;

    // y=0: Row A
    builder.land(STEEL).land(STEEL, STEEL).land(STEEL).land(DRAW_CARD).land(TITANIUM, TITANIUM).land();
    // y=1: Row B
    builder.ocean().land(DELEGATE).land(STEEL).land().land(PLANT).ocean(PLANT, PLANT).ocean(TITANIUM, TITANIUM);
    // y=2: Row C
    builder.ocean(STEEL, STEEL).land().land(DRAW_CARD, DRAW_CARD).land().land(PLANT).ocean().land().land();
    // y=3: Row D
    builder.land(TITANIUM).ocean().land().land().land(PLANT).land(PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT, DRAW_CARD);
    // y=4: Row E (E1 = Hecates Tholus, volcanic)
    builder.volcanic(STEEL, STEEL).land(PLANT).land(STANDARD_RESOURCE).land(PLANT).ocean(DRAW_CARD).land(PLANT).land(PLANT, PLANT).land(PLANT).land(STANDARD_RESOURCE).ocean(PLANT, PLANT);
    // y=5: Row F
    builder.land(PLANT).land(PLANT).land(PLANT, PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(STEEL, PLANT, PLANT).land(PLANT).land().land(PLANT).ocean(DRAW_CARD);
    // y=6: Row G
    builder.land(PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).land(ENERGY, ENERGY).land(ENERGY).land(ENERGY, ENERGY).land().land(PLANT).land(PLANT).land();
    // y=7: Row H (H7 = Olympus Mons, H9 = Ascraeus Mons; both volcanic)
    builder.land(PLANT).ocean(DRAW_CARD, DRAW_CARD).land(PLANT).land(ENERGY).land(ENERGY, ENERGY).land(PLANT).volcanic(DELEGATE, DELEGATE).land(STEEL).volcanic(DELEGATE);
    // y=8: Row J (J8 = Pavonis Mons, volcanic)
    builder.ocean(STEEL, TITANIUM).land().land(TITANIUM).land().land().land(PLANT, PLANT).land().volcanic(TITANIUM);
    // y=9: Row K (K7 = Arsia Mons, volcanic)
    builder.ocean().land().land(STANDARD_RESOURCE).land().land(PLANT, PLANT, PLANT).land(PLANT, PLANT).volcanic(STEEL, STEEL);
    // y=10: Row L
    builder.land().land(STEEL, TITANIUM).land(STEEL, STEEL).land().land(PLANT).land(DRAW_CARD);

    const spaces = builder.build();
    return new AmazonisPlanitiaBoard(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces, undefined, {
      oceans: MAX_OCEANS,
      temperature: MAX_TEMPERATURE,
      oxygen: MAX_OXYGEN,
      venus: MAX_VENUS,
    });
  }
}
