import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';
import {Game} from '../../../src/server/Game';
import {TiredEarth} from '../../../src/server/cards/pathfinders/TiredEarth';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';

describe('TiredEarth', function() {
  it('resolve play', function() {
    const card = new TiredEarth();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new AcquiredCompany());
    player2.playedCards.push(new AcquiredCompany());
    player2.playedCards.push(new AcquiredCompany());

    player.stock.plants = 20;
    player2.stock.plants = 20;

    turmoil.chairman = player2;
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);

    expect(player.stock.plants).to.eq(19);
    expect(player2.stock.plants).to.eq(20);
  });
});
