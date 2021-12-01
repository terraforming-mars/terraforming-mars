import {expect} from 'chai';
import {AcquiredCompany} from '../../src/cards/base/AcquiredCompany';
import {Game} from '../../src/Game';
import {TiredEarth} from '../../src/turmoil/globalEvents/TiredEarth';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('TiredEarth', function() {
  it('resolve play', function() {
    const card = new TiredEarth();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new AcquiredCompany());
    player2.playedCards.push(new AcquiredCompany());
    player2.playedCards.push(new AcquiredCompany());

    player.plants = 20;
    player2.plants = 20;

    turmoil.chairman = player2.id;
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);

    expect(player.plants).to.eq(19);
    expect(player2.plants).to.eq(20);
  });
});
