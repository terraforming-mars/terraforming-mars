import {expect} from 'chai';
import {PowerPlant} from '../../src/server/cards/pathfinders/PowerPlant';
import {Game} from '../../src/server/Game';
import {BalancedDevelopment} from '../../src/server/turmoil/globalEvents/BalancedDevelopment';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('BalancedDevelopment', function() {
  it('resolve play', function() {
    const card = new BalancedDevelopment();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
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
