import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {StrongSociety} from '../../src/server/turmoil/globalEvents/StrongSociety';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';
import {addCityTile} from '../TestingUtils';

describe('StrongSociety', function() {
  it('resolve play', function() {
    const card = new StrongSociety();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    addCityTile(player);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(6);
  });
});
