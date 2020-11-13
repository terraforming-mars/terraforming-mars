import {expect} from 'chai';
import {UndergroundCity} from '../../src/cards/UndergroundCity';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';

describe('UndergroundCity', function() {
  let card : UndergroundCity; let player : Player; let game : Game;

  beforeEach(function() {
    card = new UndergroundCity();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player, game)).is.true;
    const action = card.play(player, game);
    expect(action).is.not.undefined;

    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesInPlay()).to.eq(1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });
});
