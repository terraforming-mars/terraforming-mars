import {expect} from 'chai';
import {RegoPlastics} from '../../../src/cards/promo/RegoPlastics';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('RegoPlastics', function() {
  let card : RegoPlastics; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RegoPlastics();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getSteelValue(game)).to.eq(3);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
