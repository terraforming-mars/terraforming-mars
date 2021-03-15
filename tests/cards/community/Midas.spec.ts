import {expect} from 'chai';
import {Midas} from '../../../src/cards/community/Midas';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Midas', function() {
  let card : Midas; let player : Player;

  beforeEach(function() {
    card = new Midas();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Starts with correct TR', function() {
    const initialTR = player.getTerraformRating();

    card.play(player);
    player.corporationCard = card;
    expect(player.getTerraformRating()).to.eq(initialTR - 7);
  });
});
