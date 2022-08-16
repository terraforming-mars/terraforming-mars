import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {StrongSociety} from '../../src/server/turmoil/globalEvents/StrongSociety';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('StrongSociety', function() {
  it('resolve play', function() {
    const card = new StrongSociety();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(2);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(6);
  });
});
