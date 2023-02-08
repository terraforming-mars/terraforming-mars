import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, forceGenerationEnd} from '../../TestingUtils';
import {Clarke} from '../../../src/server/cards/ceos/Clarke';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Clarke', function() {
  let card: Clarke;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Clarke();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Can only act once per game', function() {
    expect(card.canAct(player)).is.true;

    card.action(player);
    runAllActions(game);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    expect(card.action(player)).is.undefined;
    expect(player.plants).eq(4);
    expect(player.heat).eq(4);
  });
});
