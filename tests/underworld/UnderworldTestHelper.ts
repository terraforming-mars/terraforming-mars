import {expect} from 'chai';
import {cast} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {PlayerInput} from '../../src/server/PlayerInput';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';

export class UnderworldTestHelper {
  public static assertIsExcavationAction(player: TestPlayer, input: PlayerInput | undefined) {
    const selectSpace = cast(input, SelectSpace);
    const space = selectSpace.spaces[0];

    expect(space.excavator).is.undefined;

    const plants = player.plants;
    space.undergroundResources = 'plant1';
    selectSpace.cb(space);

    expect(space.excavator).eq(player);
    expect(player.plants - plants).eq(1);
  }
}
