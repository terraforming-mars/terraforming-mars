import {expect} from 'chai';
import {BalancedDevelopment} from '../../../src/server/cards/pathfinders/BalancedDevelopment';
import {testGame} from '../../TestingUtils';

describe('BalancedDevelopment', () => {
  it('resolve play', () => {
    const card = new BalancedDevelopment();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    turmoil.initGlobalEvent(game);
    player.tagsForTest = {mars: 1};
    player2.tagsForTest = {mars: 2};

    turmoil.chairman = player2;
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);

    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(10);
  });
});
