import {expect} from 'chai';
import {Research} from '../../src/cards/base/Research';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {SpinoffProducts} from '../../src/turmoil/globalEvents/SpinoffProducts';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestingUtils';

describe('SpinoffProducts', function() {
  it('resolve play', function() {
    const card = new SpinoffProducts();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new Research());
    player2.playedCards.push(new Research());
    player2.playedCards.push(new Research());

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(4);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(14);
  });
});
