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
  const tokenCount = player.underworldData.tokens.length;

  if (ignorePlacementRestrictions) {
    const strictlyExcavatableSpaces = UnderworldExpansion.excavatableSpaces(player, {ignoreTunnelingLoophole: true});
    expect(oneWayDifference(candidateSpaces, strictlyExcavatableSpaces)).is.not.empty;
  }

  if (_space !== undefined) {
    expect(selectSpace.spaces, 'Supplied space is not an eligible excavatable space').includes(_space);
  }
  const space = _space ?? selectSpace.spaces[0];

  expect(space.excavator).is.undefined;

  space.undergroundResources = 'nothing';
  const pi = selectSpace.cb(space);

  expect(space.excavator, 'space does not have an excavator token').eq(player);
  expect(player.underworldData.tokens, 'player\'s token count has not grown by 1').to.have.length(tokenCount + 1);
  return pi;
}

export function assertIsClaimAction(player: TestPlayer, input: PlayerInput | undefined) {
  const selectSpace = cast(input, SelectSpace);
  const tokenCount = player.underworldData.tokens.length;
  const space = selectSpace.spaces[0];

  expect(space.excavator).is.undefined;

  space.undergroundResources = 'nothing';
  const pi = selectSpace.cb(space);

  expect(space.excavator).is.undefined;
  expect(player.underworldData.tokens).to.have.length(tokenCount + 1);
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
