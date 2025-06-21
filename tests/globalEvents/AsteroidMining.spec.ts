import {expect} from 'chai';
import {AsteroidMining} from '../../src/server/turmoil/globalEvents/AsteroidMining';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('AsteroidMining (global event)', () => {
  it('resolve play', () => {
    const card = new AsteroidMining();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.tagsForTest = {jovian: 1};
    player2.tagsForTest = {jovian: 2};

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.titanium).to.eq(1);
    expect(player2.titanium).to.eq(5);
  });
});
