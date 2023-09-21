import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGame} from '../../TestGame';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

import {Jane} from '../../../src/server/cards/ceos/Jane';

describe('Jane', function() {
  let card: Jane;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Jane();
    [game, player, player2] = testGame(2, {ceoExtension: true});
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

//   it('tests go here', function() {
//   });
});
