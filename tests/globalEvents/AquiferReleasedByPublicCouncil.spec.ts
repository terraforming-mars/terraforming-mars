import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {AquiferReleasedByPublicCouncil} from '../../src/server/turmoil/globalEvents/AquiferReleasedByPublicCouncil';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('AquiferReleasedByPublicCouncil', function() {
  it('resolve play', function() {
    const card = new AquiferReleasedByPublicCouncil();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
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
