import {expect} from 'chai';
import {HomeworldSupport} from '../../src/server/turmoil/globalEvents/HomeworldSupport';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

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
    //
    // This currently fails, granting 4 M€: the behavior DSL counts tags in 'default'
    // mode, which includes wild tags, and Countable has no way to ask for raw tags.
    expect(player.megaCredits).to.eq(2);
  });
});
