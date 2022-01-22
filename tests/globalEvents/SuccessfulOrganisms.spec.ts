import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {SuccessfulOrganisms} from '../../src/turmoil/globalEvents/SuccessfulOrganisms';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('SuccessfulOrganisms', function() {
  it('resolve play', function() {
    const card = new SuccessfulOrganisms();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    player.addProduction(Resources.PLANTS, 3);
    player2.addProduction(Resources.PLANTS, 3);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.PLANTS)).to.eq(3);
    expect(player2.getResource(Resources.PLANTS)).to.eq(6);
  });
});
