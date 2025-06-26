import {expect} from 'chai';
import {InterplanetaryTrade} from '../../src/server/turmoil/globalEvents/InterplanetaryTrade';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('InterplanetaryTrade', () => {
  it('resolve play', () => {
    const card = new InterplanetaryTrade();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.tagsForTest = {space: 1};
    player2.tagsForTest = {space: 2};

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(10);
  });
});
