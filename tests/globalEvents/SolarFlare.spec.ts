import {expect} from 'chai';
import {SolarFlare} from '../../src/server/turmoil/globalEvents/SolarFlare';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('SolarFlare', () => {
  it('resolve play', () => {
    const card = new SolarFlare();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.tagsForTest = {space: 1};
    player2.tagsForTest = {space: 3};
    player.megaCredits = 10;
    player2.megaCredits = 10;

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(7);
    expect(player2.megaCredits).to.eq(10);
  });
});
