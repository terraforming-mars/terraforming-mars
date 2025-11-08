import {expect} from 'chai';
import {VenusInfrastructure} from '../../src/server/turmoil/globalEvents/VenusInfrastructure';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('VenusInfrastructure', () => {
  it('resolve play', () => {
    const card = new VenusInfrastructure();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.tagsForTest = {venus: 1};
    player2.tagsForTest = {venus: 3};


    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(12);
  });
});
