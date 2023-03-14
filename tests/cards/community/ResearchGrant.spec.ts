import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {ResearchGrant} from '../../../src/server/cards/community/ResearchGrant';
import {TestPlayer} from '../../TestPlayer';

describe('ResearchGrant', function() {
  let card: ResearchGrant;
  let player: TestPlayer;

  beforeEach(function() {
    card = new ResearchGrant();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(8);
  });
});
