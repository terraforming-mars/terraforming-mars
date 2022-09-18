import {expect} from 'chai';
import {TopsoilContract} from '../../../src/server/cards/promo/TopsoilContract';
import {Player} from '../../../src/server/Player';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Game} from '../../../src/server/Game';
import {AerobrakedAmmoniaAsteroid} from '../../../src/server/cards/base/AerobrakedAmmoniaAsteroid';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';

describe('TopsoilContract', function() {
  let card: TopsoilContract;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    card = new TopsoilContract();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can play', function() {
    card.play(player);
    runAllActions(game);

    expect(player.plants).to.eq(3);
  });

  it('Gives 1 M€ whenever player gains a microbe', function() {
    player.playedCards.push(card);

    // Get MC when player gains microbes
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);
    tardigrades.action(player);
    expect(player.megaCredits).to.eq(1);

    const aerobrakedAmmoniaAsteroid = new AerobrakedAmmoniaAsteroid();
    aerobrakedAmmoniaAsteroid.play(player);
    runAllActions(game);
    expect(tardigrades.resourceCount).to.eq(3);
    expect(player.megaCredits).to.eq(3);

    // Don't get MC when other players gain microbes
    const ants = new Ants();
    player2.playedCards.push(ants);
    ants.action(player2);
    expect(player.megaCredits).to.eq(3);
  });
});
