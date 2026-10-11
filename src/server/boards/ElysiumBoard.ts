import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BoardBuilder} from './BoardBuilder';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';

export class ElysiumBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): ElysiumBoard {
    const builder = new BoardBuilder(gameOptions, rng);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;

    // y=0
    builder.row((r) => r.ocean().ocean(TITANIUM).ocean(DRAW_CARD).ocean(STEEL).land(DRAW_CARD));
    // y=1
    builder.row((r) => r.volcanic(TITANIUM).land().land().ocean().ocean().land(STEEL, STEEL));
    // y=2
    builder.row((r) => r.volcanic(TITANIUM, TITANIUM).land().land(DRAW_CARD).land().ocean(PLANT).ocean().volcanic(DRAW_CARD, DRAW_CARD, DRAW_CARD));
    // y=3
    builder.row((r) => r.land(PLANT).land(PLANT).land(PLANT).ocean(PLANT, PLANT).land(PLANT).ocean(PLANT).ocean(PLANT).land(PLANT, STEEL));
    // y=4
    builder.row((r) => r.land(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).volcanic(PLANT, TITANIUM));
    // y=5
    builder.row((r) => r.land(STEEL).land(PLANT).land(PLANT).land(PLANT).land(PLANT).land(PLANT).land(PLANT).land());
    // y=6
    builder.row((r) => r.land(TITANIUM).land(STEEL).land().land().land(STEEL).land().land());
    // y=7
    builder.row((r) => r.land(STEEL, STEEL).land().land().land().land(STEEL, STEEL).land());
    // y=8
    builder.row((r) => r.land(STEEL).land().land(DRAW_CARD).land(DRAW_CARD).land(STEEL, STEEL));

    const spaces = builder.build();
    return new ElysiumBoard(spaces);
  }
}
