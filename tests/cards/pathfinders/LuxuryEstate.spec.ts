import {expect} from 'chai';
import {LuxuryEstate} from '../../../src/cards/pathfinders/LuxuryEstate';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('LuxuryEstate', function() {
  let card: LuxuryEstate;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new LuxuryEstate();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    (game as any).oxygenLevel = 6;
    expect(player.canPlayIgnoringCost(card)).is.false;

    (game as any).oxygenLevel = 7;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', function() {
    card.play(player);
    expect(player.titanium).eq(0);

    player.titanium = 0;
    TestingUtils.addCity(player);
    card.play(player);
    expect(player.titanium).eq(1);

    player.titanium = 0;
    TestingUtils.addCity(player);
    card.play(player);
    expect(player.titanium).eq(2);

    player.titanium = 0;
    TestingUtils.addGreenery(player);
    card.play(player);
    expect(player.titanium).eq(3);

    // Other player's cities don't count.
    player.titanium = 0;
    TestingUtils.addCity(player2);
    card.play(player);
    expect(player.titanium).eq(3);
  });
});
