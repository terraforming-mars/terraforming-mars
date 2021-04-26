import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {Riots} from '../../src/turmoil/globalEvents/Riots';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('Riots', function() {
  it('resolve play', function() {
    const card = new Riots();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    player.addResource(Resources.MEGACREDITS, 10);
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(6);
  });
});
