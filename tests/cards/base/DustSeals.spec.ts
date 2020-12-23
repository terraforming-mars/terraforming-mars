import {expect} from 'chai';
import {DustSeals} from '../../../src/cards/base/DustSeals';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {maxOutOceans, TestPlayers} from '../../TestingUtils';

describe('DustSeals', function() {
  let card : DustSeals; let player : Player; let game : Game;

  beforeEach(function() {
    card = new DustSeals();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    maxOutOceans(player, game, 4);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player, game)).is.true;
    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});

