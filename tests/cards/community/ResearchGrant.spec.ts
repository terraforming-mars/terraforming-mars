import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {ResearchGrant} from '../../../src/server/cards/community/ResearchGrant';
import {TestPlayer} from '../../TestPlayer';

describe('ResearchGrant', function() {
  let card: ResearchGrant;
  let player: TestPlayer;

  beforeEach(function() {
    card = new ResearchGrant();
    [/* game */, player] = testGame(1);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(8);
  });
});
