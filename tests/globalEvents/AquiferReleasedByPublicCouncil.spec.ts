import {expect} from 'chai';
import {AquiferReleasedByPublicCouncil} from '../../src/server/turmoil/globalEvents/AquiferReleasedByPublicCouncil';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('AquiferReleasedByPublicCouncil', function() {
  it('resolve play', function() {
    const card = new AquiferReleasedByPublicCouncil();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player);
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.steel).to.eq(1);
    expect(player2.steel).to.eq(3);
    expect(player.plants).to.eq(1);
    expect(player2.plants).to.eq(3);
  });
});
