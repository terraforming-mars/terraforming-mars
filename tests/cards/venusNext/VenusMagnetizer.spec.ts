import {expect} from 'chai';
import {VenusMagnetizer} from '../../../src/server/cards/venusNext/VenusMagnetizer';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('VenusMagnetizer', function() {
  let card: VenusMagnetizer;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new VenusMagnetizer();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).venusScaleLevel = 8;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).venusScaleLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(card.play(player)).is.undefined;
  });

  it('Should act', function() {
    player.production.add(Resources.ENERGY, 2);
    player.playedCards.push(card);

    card.action(player);
    expect(player.production.energy).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
