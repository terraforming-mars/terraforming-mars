import {expect} from 'chai';
import {TopsoilContract} from '../../../src/cards/promo/TopsoilContract';
import {Player} from '../../../src/Player';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {Ants} from '../../../src/cards/base/Ants';
import {Game} from '../../../src/Game';
import {AerobrakedAmmoniaAsteroid} from '../../../src/cards/base/AerobrakedAmmoniaAsteroid';
import {TestPlayers} from '../../TestPlayers';

describe('TopsoilContract', function() {
  let card : TopsoilContract; let player : Player; let player2 : Player;

  beforeEach(function() {
    card = new TopsoilContract();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Can play', function() {
    card.play(player);
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
    expect(tardigrades.resourceCount).to.eq(3);
    expect(player.megaCredits).to.eq(3);

    // Don't get MC when other players gain microbes
    const ants = new Ants();
    player2.playedCards.push(ants);
    ants.action(player2);
    expect(player.megaCredits).to.eq(3);
  });
});
