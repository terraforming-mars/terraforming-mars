import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

import {Greta} from '../../../src/server/cards/ceos/Greta';

import {Omnicourt} from '../../../src/server/cards/venusNext/Omnicourt';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Greta', function() {
  let card: Greta;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Greta();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player.playCard(card);
  });

  it('Gains 4 M€ per TR raise action when OPG action is used', function() {
    // doesnt gain before card action
    player.playCard(new BigAsteroid());
    expect(player.megaCredits).to.eq(0);

    card.action();

    player.playCard(new BigAsteroid());
    expect(player.megaCredits).to.eq(4);

    player.playCard(new Omnicourt());
    expect(player.megaCredits).to.eq(8);

    player.game.increaseOxygenLevel(player, 1);
    expect(player.megaCredits).to.eq(12);

    player.game.increaseVenusScaleLevel(player, 1);
    expect(player.megaCredits).to.eq(16);
  });

  it('Can only act once per game, no income when not active', function() {
    card.action();
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 0;
    player.game.increaseVenusScaleLevel(player, 1);
    expect(player.megaCredits).to.eq(0);
  });
});
