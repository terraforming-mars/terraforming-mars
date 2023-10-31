import {expect} from 'chai';
import {MethaneFromTitan} from '../../src/server/cards/base/MethaneFromTitan';
import {Game} from '../../src/server/Game';
import {InterplanetaryTrade} from '../../src/server/turmoil/globalEvents/InterplanetaryTrade';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('InterplanetaryTrade', function() {
  it('resolve play', function() {
    const card = new InterplanetaryTrade();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(10);
  });
});
