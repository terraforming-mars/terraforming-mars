import {expect} from 'chai';
import {PowerPlant} from '../../src/cards/pathfinders/PowerPlant';
import {Game} from '../../src/Game';
import {BalancedDevelopment} from '../../src/turmoil/globalEvents/BalancedDevelopment';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('BalancedDevelopment', function() {
  it('resolve play', function() {
    const card = new BalancedDevelopment();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new PowerPlant());
    player2.playedCards.push(new PowerPlant());
    player2.playedCards.push(new PowerPlant());

    turmoil.chairman = player2.id;
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);

    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(10);
  });
});
