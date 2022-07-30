import {expect} from 'chai';
import {ResearchGrant} from '../../../src/cards/community/ResearchGrant';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('ResearchGrant', function() {
  let card: ResearchGrant;
  let player: Player;

  beforeEach(function() {
    card = new ResearchGrant();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(8);
  });
});
