import {expect} from 'chai';
import {cast, formatMessage} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {PlayerInput} from '../../src/server/PlayerInput';
import {SelectColony} from '../../src/server/inputs/SelectColony';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {Luna} from '../../src/server/colonies/Luna';
import {AndOptions} from '../../src/server/inputs/AndOptions';

export function assertBuildColony(player: TestPlayer, input: PlayerInput | undefined, idx: number = 0) {
  const selectColony = cast(input, SelectColony);
  const colony = selectColony.colonies[idx];
  expect(colony.colonies).is.empty;

  selectColony.cb(colony);

  expect(colony.colonies).deep.eq([player.id]);
}

export function assertNoTradeAction(player: TestPlayer) {
  const actions = player.getActions();
  const tradeAction = actions.options.find(
    (option) => option.title === 'Trade with a colony tile');

  expect(tradeAction).is.undefined;
}

export function assertTradeAction(player: TestPlayer, optionTitle: string) {
  const luna = new Luna();
  player.game.colonies = [luna];
  const mc = player.megaCredits;

  const actions = player.getActions();
  const tradeAction = actions.options.find((option) => option.title === 'Trade with a colony tile');
  if (tradeAction === undefined) {
    throw new Error('No trade action found');
  }

  const andOptions = cast(tradeAction, AndOptions);

  const payAction = cast(andOptions.options[0], OrOptions);
  expect(payAction.title).eq('Pay trade fee');
  expect(payAction.options).has.length(1);

  const option = cast(payAction, OrOptions).options[0];
  expect(formatMessage(option.title)).to.eq(optionTitle);

  option.cb();
  andOptions.options[1].cb(luna);

  expect(player.megaCredits).eq(mc + 2);
}
