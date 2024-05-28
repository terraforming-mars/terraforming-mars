import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';
import {TiredEarth} from '../../../src/server/cards/pathfinders/TiredEarth';
import {testGame} from '../../TestingUtils';

describe('TiredEarth', function() {
  it('resolve play', function() {
    const card = new TiredEarth();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new AcquiredCompany());
    player2.playedCards.push(new AcquiredCompany());
    player2.playedCards.push(new AcquiredCompany());

    player.plants = 20;
    player2.plants = 20;

    turmoil.chairman = player2;
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);

    expect(player.plants).to.eq(19);
    expect(player2.plants).to.eq(20);
  });
});
