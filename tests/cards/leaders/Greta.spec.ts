import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

import {Greta} from '../../../src/server/cards/leaders/Greta';

import {Omnicourt} from '../../../src/server/cards/venusNext/Omnicourt';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';


describe('Greta', function() {
  let card: Greta;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Greta();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);

    player.playedCards.push(card);
  });

  it('Gains 4 M€ per TR raise action when OPG action is used', function() {
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

  it('Can only act once per game', function() {
    card.action();
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
