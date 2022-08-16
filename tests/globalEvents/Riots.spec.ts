import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {Riots} from '../../src/server/turmoil/globalEvents/Riots';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('Riots', function() {
  it('resolve play', function() {
    const card = new Riots();
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    player.addResource(Resources.MEGACREDITS, 10);
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(6);
  });
});
