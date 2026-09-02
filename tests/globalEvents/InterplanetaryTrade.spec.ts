import {expect} from 'chai';
import {InterplanetaryTrade} from '../../src/server/turmoil/globalEvents/InterplanetaryTrade';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';
import {Asteroid} from '../../src/server/cards/base/Asteroid';
import {Odyssey} from '../../src/server/cards/pathfinders/Odyssey';

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

    card.resolve(game);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(10);
  });

  it('counts event tags when the player has Odyssey', () => {
    const card = new InterplanetaryTrade();
    const [game, player] = testGame(2, {turmoilExtension: true});
    player.playedCards.push(new Asteroid()); // Event, Space

    card.resolve(game);

    // Events are face down, so the space tag doesn't count.
    expect(player.megaCredits).to.eq(0);

    player.playedCards.push(new Odyssey());
    card.resolve(game);

    // Odyssey leaves events face up, and that applies to global events too.
    expect(player.megaCredits).to.eq(2);
  });
});
