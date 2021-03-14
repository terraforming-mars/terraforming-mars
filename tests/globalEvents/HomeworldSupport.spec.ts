import {expect} from 'chai';
import {Sponsors} from '../../src/cards/base/Sponsors';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {HomeworldSupport} from '../../src/turmoil/globalEvents/HomeworldSupport';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('HomeworldSupport', function() {
  it('resolve play', function() {
    const card = new HomeworldSupport();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
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
