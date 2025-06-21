import {expect} from 'chai';
import {GlobalDustStorm} from '../../src/server/turmoil/globalEvents/GlobalDustStorm';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('GlobalDustStorm', () => {
  it('resolve play', () => {
    const card = new GlobalDustStorm();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.tagsForTest = {building: 1};
    player2.tagsForTest = {building: 2};
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    player.megaCredits = 10;
    player2.megaCredits = 10;
    player.heat = 7;
    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(8);
    expect(player.heat).to.eq(0);
    expect(player2.megaCredits).to.eq(10);
  });
});
