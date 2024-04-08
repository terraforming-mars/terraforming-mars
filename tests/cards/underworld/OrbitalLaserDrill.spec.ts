import {expect} from 'chai';

import {OrbitalLaserDrill} from '../../../src/server/cards/underworld/OrbitalLaserDrill';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('OrbitalLaserDrill', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: OrbitalLaserDrill;

  beforeEach(() => {
    [game, player] = testGame(1, {underworldExpansion: true});
    card = new OrbitalLaserDrill();
  });

  it('can play', () => {
    player.tagsForTest = {science: 1};

    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {science: 2};

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    expect(card.play(player)).is.undefined;

    runAllActions(game);

    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor(), true);

    runAllActions(game);

    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor(), true);

    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });
});
