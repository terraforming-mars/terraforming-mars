import {expect} from 'chai';
import {Sponsors} from '../../src/server/cards/base/Sponsors';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
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

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(2);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(10);
  });
});
