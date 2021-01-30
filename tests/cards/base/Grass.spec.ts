import {expect} from 'chai';
import {Grass} from '../../../src/cards/base/Grass';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Grass', function() {
  let card : Grass; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Grass();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -16;
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.plants).to.eq(3);
  });
});
