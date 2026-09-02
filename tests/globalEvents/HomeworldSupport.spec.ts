import {expect} from 'chai';
import {HomeworldSupport} from '../../src/server/turmoil/globalEvents/HomeworldSupport';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {fakeCard, testGame} from '../TestingUtils';
import {EarthEmbassy} from '../../src/server/cards/moon/EarthEmbassy';
import {Chimera} from '../../src/server/cards/pathfinders/Chimera';
import {Tag} from '../../src/common/cards/Tag';

describe('HomeworldSupport', () => {
  it('resolve play', () => {
    const card = new HomeworldSupport();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.tagsForTest = {earth: 1};
    player2.tagsForTest = {earth: 2};

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(10);
  });

  it('does not count wild tags', () => {
    const card = new HomeworldSupport();
    const [game, player] = testGame(2, {turmoilExtension: true});
    player.tagsForTest = {earth: 1, wild: 1};

    card.resolve(game);

    // Wild tags apply when taking an action, not when resolving a global event, so
    // only the Earth tag counts. (Compare the 'globalEvent' DistinctCountMode.)
    expect(player.megaCredits).to.eq(2);
  });

  it('does not count Moon tags as Earth tags with Earth Embassy', () => {
    const card = new HomeworldSupport();
    const [game, player] = testGame(2, {turmoilExtension: true, moonExpansion: true});
    player.playedCards.push(new EarthEmbassy());
    player.tagsForTest = {earth: 1, moon: 2};

    card.resolve(game);

    // Earth Embassy is another action-only substitution, so the Moon tags don't count.
    expect(player.megaCredits).to.eq(2);
  });

  it('does not count Chimera wild tags', () => {
    const card = new HomeworldSupport();
    const [game, player] = testGame(2, {turmoilExtension: true});
    player.playedCards.push(new Chimera(), fakeCard({tags: [Tag.EARTH]}));

    card.resolve(game);

    // Chimera's two wild tags are still wild tags here. Its milestone and award
    // adjustments don't apply to global events either.
    expect(player.megaCredits).to.eq(2);
  });
});
