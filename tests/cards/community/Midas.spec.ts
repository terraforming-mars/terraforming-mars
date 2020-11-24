import {expect} from 'chai';
import {Midas} from '../../../src/cards/community/corporations/Midas';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';

describe('Midas', function() {
  let card : Midas; let player : Player;

  beforeEach(function() {
    card = new Midas();
    player = new Player('test', Color.BLUE, false);
  });

  it('Starts with correct TR', function() {
    const initialTR = player.getTerraformRating();

    card.play(player);
    player.corporationCard = card;
    expect(player.getTerraformRating()).to.eq(initialTR - 7);
  });
});
