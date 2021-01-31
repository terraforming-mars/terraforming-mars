import {expect} from 'chai';
import {CaretakerContract} from '../../../src/cards/base/CaretakerContract';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('CaretakerContract', function() {
  let card : CaretakerContract; let player : Player; let game : Game;

  beforeEach(function() {
    card = new CaretakerContract();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play or act', function() {
    expect(card.canPlay(player)).is.not.true;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = 0;
    expect(card.canPlay(player)).is.true;
  });

  it('Should act', function() {
    player.heat = 8;
    card.action(player);
    expect(player.heat).to.eq(0);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
