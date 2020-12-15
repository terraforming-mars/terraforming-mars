import {Board} from '../../src/Board';
import {BoardBuilder} from '../../src/BoardBuilder';
import {RandomBoardOptionType} from '../../src/RandomBoardOptionType';

export class EmptyBoard extends Board {
  constructor() {
    super();

    const builder = new BoardBuilder(RandomBoardOptionType.NONE, 0);

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

    this.spaces = builder.build();
  }
}
