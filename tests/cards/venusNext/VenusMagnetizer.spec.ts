import {expect} from 'chai';
import {VenusMagnetizer} from '../../../src/cards/venusNext/VenusMagnetizer';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('VenusMagnetizer', function() {
  let card : VenusMagnetizer; let player : Player; let game : Game;

  beforeEach(function() {
    card = new VenusMagnetizer();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    (game as any).venusScaleLevel = 8;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).venusScaleLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(card.play()).is.undefined;
  });

  it('Should act', function() {
    player.addProduction(Resources.ENERGY, 2);
    player.playedCards.push(card);

    card.action(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
