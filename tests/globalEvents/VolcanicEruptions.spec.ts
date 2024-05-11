import {expect} from 'chai';
import {VolcanicEruptions} from '../../src/server/turmoil/globalEvents/VolcanicEruptions';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('VolcanicEruptions', function() {
  it('resolve play', function() {
    const card = new VolcanicEruptions();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.production.heat).to.eq(0);
    expect(player2.production.heat).to.eq(3);
    expect(game.getTemperature()).to.eq(-26);
  });
});
