import {expect} from 'chai';
import {StrongSociety} from '../../src/turmoil/globalEvents/StrongSociety';
import {Player} from '../../src/Player';
import {Color} from '../../src/Color';
import {Game} from '../../src/Game';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Resources} from '../../src/Resources';

describe('StrongSociety', function() {
  it('resolve play', function() {
    const card = new StrongSociety();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);
    const turmoil = new Turmoil(game, false);

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
