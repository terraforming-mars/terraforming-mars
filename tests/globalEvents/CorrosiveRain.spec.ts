import {expect} from 'chai';
import {Game} from '../../src/Game';
import {CorrosiveRain} from '../../src/turmoil/globalEvents/CorrosiveRain';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';
import {TestingUtils} from '../TestingUtils';

describe('CorrosiveRain', function() {
  it('resolve play', function() {
    const card = new CorrosiveRain();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    player.megaCredits = 15;
    player2.megaCredits = 15;

    card.resolve(game, turmoil);
    expect(game.deferredActions).has.lengthOf(2);
    TestingUtils.runAllActions(game);
    expect(game.deferredActions).has.lengthOf(0);
    expect(player2.cardsInHand).has.lengthOf(3);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(5);
    expect(player2.megaCredits).to.eq(5);
  });
});
