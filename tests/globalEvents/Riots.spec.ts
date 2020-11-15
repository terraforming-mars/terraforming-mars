import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {Riots} from '../../src/turmoil/globalEvents/Riots';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestingUtils';

describe('Riots', function() {
  it('resolve play', function() {
    const card = new Riots();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player], player);
    const turmoil = new Turmoil(game, false);
    turmoil.initGlobalEvent(game);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    player.setResource(Resources.MEGACREDITS, 10);
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(6);
  });
});
