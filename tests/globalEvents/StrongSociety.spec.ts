import {expect} from 'chai';
import {StrongSociety} from '../../src/server/turmoil/globalEvents/StrongSociety';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {addCity, testGame} from '../TestingUtils';

describe('StrongSociety', function() {
  it('resolve play', function() {
    const card = new StrongSociety();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    addCity(player);
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(6);
  });
});
