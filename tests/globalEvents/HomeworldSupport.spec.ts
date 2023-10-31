import {expect} from 'chai';
import {Sponsors} from '../../src/server/cards/base/Sponsors';
import {Game} from '../../src/server/Game';
import {HomeworldSupport} from '../../src/server/turmoil/globalEvents/HomeworldSupport';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('HomeworldSupport', function() {
  it('resolve play', function() {
    const card = new HomeworldSupport();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new Sponsors());
    player2.playedCards.push(new Sponsors());
    player2.playedCards.push(new Sponsors());

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
