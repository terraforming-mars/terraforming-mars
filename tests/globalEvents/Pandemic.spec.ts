import {expect} from 'chai';
import {Pandemic} from '../../src/server/turmoil/globalEvents/Pandemic';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('Pandemic', () => {
  it('resolve play', () => {
    const card = new Pandemic();
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
    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(7);
    expect(player2.megaCredits).to.eq(10);
  });
});
