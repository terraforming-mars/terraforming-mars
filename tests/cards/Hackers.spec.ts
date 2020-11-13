import {expect} from 'chai';
import {Hackers} from '../../src/cards/Hackers';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Resources} from '../../src/Resources';

describe('Hackers', function() {
  let card : Hackers; let player : Player;

  beforeEach(function() {
    card = new Hackers();
    player = new Player('test', Color.BLUE, false);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player)).is.true;
  });
});
