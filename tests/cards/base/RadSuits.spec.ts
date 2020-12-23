import {expect} from 'chai';
import {RadSuits} from '../../../src/cards/base/RadSuits';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('RadSuits', function() {
  let card : RadSuits; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RadSuits();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    const lands = game.board.getAvailableSpacesOnLand(player);
    game.addCityTile(player, lands[0].id);
    game.addCityTile(player, lands[1].id);

    expect(card.canPlay(player, game)).is.true;
    card.play(player, game);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
