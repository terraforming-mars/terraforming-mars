import {Board} from '../../src/boards/Board';
import {BoardBuilder} from '../../src/boards/BoardBuilder';

export class EmptyBoard extends Board {
  public static newInstance() {
    const builder = new BoardBuilder(false, false);

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

    return new EmptyBoard(builder.build());
  }
  public getVolcanicSpaceIds(): Array<string> {
    return [];
  }

  public getNoctisCitySpaceIds(): Array<string> {
    return [];
  }
}
