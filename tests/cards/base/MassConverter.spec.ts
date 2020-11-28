import {expect} from 'chai';
import {MassConverter} from '../../../src/cards/base/MassConverter';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TollStation} from '../../../src/cards/base/TollStation';
import {Resources} from '../../../src/Resources';

describe('MassConverter', function() {
  let card : MassConverter; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MassConverter();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card, card);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(6);
    expect(card.getCardDiscount(player, game, card)).to.eq(0);
    expect(card.getCardDiscount(player, game, new TollStation())).to.eq(2);
  });
});
