import {expect} from 'chai';
import {RadSuits} from '../../../src/cards/base/RadSuits';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('RadSuits', function() {
  let card: RadSuits;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RadSuits();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    const lands = game.board.getAvailableSpacesOnLand(player);
    game.addCityTile(player, lands[0].id);
    game.addCityTile(player, lands[1].id);

    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
