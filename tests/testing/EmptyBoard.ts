import {MarsBoard} from '../../src/server/boards/MarsBoard';
import {BoardBuilder} from '../../src/server/boards/BoardBuilder';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';

export class EmptyBoard extends MarsBoard {
  public static newInstance() {
    const builder = new BoardBuilder(DEFAULT_GAME_OPTIONS);

    // y=0
    builder.land().land().land().land().land();
    // y=1
    builder.land().land().land().land().land().land();
    // y=2
    builder.land().land().land().land().land().land().land();
    // y=3
    builder.land().land().land().land().land().land().land().land();
    // y=4
    builder.land().land().land().land().land().land().land().land().land();
    // y=5
    builder.land().land().land().land().land().land().land().land();
    // y=6
    builder.land().land().land().land().land().land().land();
    // y=7
    builder.land().land().land().land().land().land();
    // y=8
    builder.land().land().land().land().land();

    return new EmptyBoard(builder.build(), undefined, []);
  }
}
