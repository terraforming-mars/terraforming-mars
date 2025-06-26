import {expect} from 'chai';
import {ImprovedEnergyTemplates} from '../../src/server/turmoil/globalEvents/ImprovedEnergyTemplates';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('ImprovedEnergyTemplates', () => {
  it('resolve play', () => {
    const card = new ImprovedEnergyTemplates();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.tagsForTest = {power: 1};
    player2.tagsForTest = {power: 2};
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    card.resolve(game, turmoil);
    expect(player.production.energy).to.eq(0);
    expect(player2.production.energy).to.eq(2);
  });
});
