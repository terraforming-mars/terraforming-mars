import {expect} from 'chai';
import {WavePower} from '../../../src/cards/base/WavePower';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {maxOutOceans, TestPlayers} from '../../TestingUtils';

describe('WavePower', function() {
  let card : WavePower; let player : Player; let game : Game;

  beforeEach(function() {
    card = new WavePower();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    maxOutOceans(player, game, 2);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, game, 3);
    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
