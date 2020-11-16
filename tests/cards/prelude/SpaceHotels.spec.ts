import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceHotels} from '../../../src/cards/prelude/SpaceHotels';

describe('SpaceHotels', function() {
  let card : SpaceHotels; let player : Player;

  beforeEach(function() {
    card = new SpaceHotels();
    player = new Player('test', Color.BLUE, false);
  });

  it('Can\'t play', function() {
    player.playedCards.push(card);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
});
