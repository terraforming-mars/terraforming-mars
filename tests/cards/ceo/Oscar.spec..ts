import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

import {Turmoil} from '../../../src/server/turmoil/Turmoil';

import {Oscar} from '../../../src/server/cards/ceos/Oscar';

describe('Oscar', function() {
  let card: Oscar;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Oscar();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.playedCards.push(card);
  });

  it('Has +1 influence', function() {
    card.play(player);
    expect(player.game.turmoil?.getPlayerInfluence(player)).eq(1);
  });

  it('Takes OPG action', function() {
    card.action(player);
    const turmoil = Turmoil.getTurmoil(player.game);
    expect(turmoil.chairman).eq(player.id);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  // TODO(dl) (low hanging fruit):
  // Test to see if action increases POLITICIAN Milestone
});
