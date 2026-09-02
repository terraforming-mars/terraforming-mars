import {expect} from 'chai';
import {Riots} from '../../src/server/turmoil/globalEvents/Riots';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {addCity, testGame} from '../TestingUtils';

describe('Riots', () => {
  it('resolve play', () => {
    const card = new Riots();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    addCity(player);
    addCity(player);
    addCity(player2);

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;

    expect(turmoil.getInfluence(player)).eq(0);
    expect(turmoil.getInfluence(player2)).eq(2);

    player.megaCredits = 20;
    player2.megaCredits = 20;

    card.resolve(game);

    // Two cities, no influence. The third city is someone else's.
    expect(player.megaCredits).to.eq(12);
    // One city against 2 influence stops at zero instead of paying out.
    expect(player2.megaCredits).to.eq(20);
  });
});
