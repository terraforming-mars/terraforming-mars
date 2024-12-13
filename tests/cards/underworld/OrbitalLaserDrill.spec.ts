import {expect} from 'chai';

import {OrbitalLaserDrill} from '../../../src/server/cards/underworld/OrbitalLaserDrill';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';

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
    cast(card.play(player), undefined);

    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor(), true);

    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor(), true);

    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });
});
