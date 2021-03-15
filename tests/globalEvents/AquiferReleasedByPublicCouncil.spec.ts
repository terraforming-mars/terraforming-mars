import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {AquiferReleasedByPublicCouncil} from '../../src/turmoil/globalEvents/AquiferReleasedByPublicCouncil';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('AquiferReleasedByPublicCouncil', function() {
  it('resolve play', function() {
    const card = new AquiferReleasedByPublicCouncil();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player.id);
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.STEEL)).to.eq(1);
    expect(player2.getResource(Resources.STEEL)).to.eq(3);
    expect(player.getResource(Resources.PLANTS)).to.eq(1);
    expect(player2.getResource(Resources.PLANTS)).to.eq(3);
  });
});
