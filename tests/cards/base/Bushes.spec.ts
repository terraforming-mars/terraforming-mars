import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Bushes', function() {
  let card : Bushes; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Bushes();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -10;
    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    expect(player.plants).to.eq(2);
  });
});
