import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {MudSlides} from '../../src/turmoil/globalEvents/MudSlides';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('MudSlides', function() {
  it('resolve play', function() {
    const card = new MudSlides();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
    const oceanTile = game.board.getAvailableSpacesForOcean(player)[0];
    game.addCityTile(player, game.board.getAdjacentSpaces(oceanTile)[0].id);
    game.addOceanTile(player, oceanTile.id);
    player.addResource(Resources.MEGACREDITS, 10);
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(6);
  });
});
