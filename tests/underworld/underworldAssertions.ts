import {expect} from 'chai';
import {cast, formatMessage} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {PlayerInput} from '../../src/server/PlayerInput';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {UnderworldExpansion} from '../../src/server/underworld/UnderworldExpansion';
import {oneWayDifference} from '../../src/common/utils/utils';
import {Space} from '../../src/server/boards/Space';

export function assertIsExcavationAction(player: TestPlayer, input: PlayerInput | undefined, ignorePlacementRestrictions: boolean = false, _space: Space | undefined = undefined) {
  const selectSpace = cast(input, SelectSpace);
  const candidateSpaces = selectSpace.spaces;

  if (ignorePlacementRestrictions) {
    const strictlyExcavatableSpaces = UnderworldExpansion.excavatableSpaces(player, {ignoreConcsesionRights: true});
    expect(oneWayDifference(candidateSpaces, strictlyExcavatableSpaces)).is.not.empty;
  }

  if (_space !== undefined) {
    expect(selectSpace.spaces).includes(_space);
  }
  const space = _space ?? selectSpace.spaces[0];

  expect(space.excavator).is.undefined;

  const plants = player.plants;
  space.undergroundResources = 'plant1';
  const pi = selectSpace.cb(space);

  expect(space.excavator).eq(player);
  expect(player.plants - plants).eq(1);
  return pi;
}

export function assertIsIdentificationAction(player: TestPlayer, input: PlayerInput | undefined) {
  const selectSpace = cast(input, SelectSpace);
  const space = selectSpace.spaces[0];

  expect(space.undergroundResources).is.undefined;

  player.defer(selectSpace.cb(space));

  expect(space.undergroundResources).is.not.undefined;
}

export function assertIsMaybeBlock(_player :TestPlayer, input: PlayerInput | undefined, choice: 'fighters' | 'corruption' | 'do not block') {
  const orOptions = cast(input, OrOptions);

  expect(formatMessage(orOptions.title)).contains('Spend 1 corruption to block an attack by');

  const option = orOptions.options.find((o) => formatMessage(o.title).toLowerCase().indexOf(choice) > -1);
    option!.cb();
}
