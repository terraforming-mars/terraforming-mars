import {expect} from 'chai';

import {Deepnuking} from '../../../src/server/cards/underworld/Deepnuking';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('Deepnuking', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: Deepnuking;

  beforeEach(() => {
    [game, player, player2] = testGame(2, {underworldExpansion: true});
    card = new Deepnuking();
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    player2.plants = 5;

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(2);
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(2);

    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });
});
