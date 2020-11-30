import {expect} from 'chai';
import {StripMine} from '../../../src/cards/base/StripMine';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('StripMine', function() {
  let card : StripMine; let player : Player; let game : Game;

  beforeEach(function() {
    card = new StripMine();
    player = TestPlayers.BLUE.newPlayer();
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(2);
  });
});
