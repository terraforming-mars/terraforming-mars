import {expect} from 'chai';
import {Midas} from '../../../src/server/cards/community/Midas';
import {TestPlayer} from '../../TestPlayer';

describe('Midas', function() {
  let card: Midas;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Midas();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Starts with correct TR', function() {
    const initialTR = player.getTerraformRating();

    card.play(player);
    player.setCorporationForTest(card);
    expect(player.getTerraformRating()).to.eq(initialTR - 7);
  });
});
