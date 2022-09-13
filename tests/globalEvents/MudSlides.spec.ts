import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {MudSlides} from '../../src/server/turmoil/globalEvents/MudSlides';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';
import {getTestPlayer, newTestGame} from '../TestGame';
import {testGameOptions} from '../TestingUtils';
import {ISpace} from '../../src/server/boards/ISpace';
import {TileType} from '../../src/common/TileType';

describe('MudSlides', function() {
  let card: MudSlides;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new MudSlides();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
  });

  it('resolve play', function() {
    const oceanTile = game.board.getAvailableSpacesForOcean(player)[0];
    game.addCityTile(player, game.board.getAdjacentSpaces(oceanTile)[0].id);
    game.addOceanTile(player, oceanTile.id);
    player.megaCredits = 10;

    card.resolve(game, turmoil);

    expect(player.getResource(Resources.MEGACREDITS)).to.eq(6);
  });

  it('resolve play with overplaced tiles', function() {
    game = newTestGame(2, testGameOptions({aresExtension: true, turmoilExtension: true}));
    player = getTestPlayer(game, 0);

    // Find two adjacent ocean spaces
    function adjacentOceans(): {first: ISpace, second: ISpace} {
      const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
      for (const space of oceanSpaces) {
        const adjacentSpaces = game.board.getAdjacentSpaces(space);
        const adjacentOceans = adjacentSpaces.filter((space) => oceanSpaces.includes(space));
        if (adjacentOceans.length > 0) {
          return {first: space, second: adjacentOceans[0]};
        }
      }
      throw new Error('Not found');
    }

    const spaces = adjacentOceans();

    game.addOceanTile(player, spaces.first.id);
    game.addOceanTile(player, spaces.second.id);

    // Add an ocean city on top of the second ocean.
    const tile = {
      tileType: TileType.OCEAN_CITY,
      covers: spaces.second.tile,
    };
    game.gameOptions.aresExtension = true;
    player.game.addTile(player, spaces.second.spaceType, spaces.second, tile);

    player.megaCredits = 10;

    card.resolve(game, turmoil);

    expect(player.getResource(Resources.MEGACREDITS)).to.eq(6);
  });
});
