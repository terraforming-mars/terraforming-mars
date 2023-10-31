import {expect} from 'chai';
import {Game} from '../../src/server/Game';
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
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player);
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.steel).to.eq(1);
    expect(player2.steel).to.eq(3);
    expect(player.plants).to.eq(1);
    expect(player2.plants).to.eq(3);
  });
});
