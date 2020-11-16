import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {ResearchGrant} from '../../../src/cards/community/ResearchGrant';

describe('ResearchGrant', function() {
  let card : ResearchGrant; let player : Player;

  beforeEach(function() {
    card = new ResearchGrant();
    player = new Player('test', Color.BLUE, false);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(8);
  });
});
