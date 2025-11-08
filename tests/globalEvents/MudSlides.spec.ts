import {expect} from 'chai';
import {IGame} from '../../src/server/IGame';
import {MudSlides} from '../../src/server/turmoil/globalEvents/MudSlides';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {Space} from '../../src/server/boards/Space';
import {TileType} from '../../src/common/TileType';

describe('MudSlides', () => {
  let card: MudSlides;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new MudSlides();
    [game, player] = testGame(2, {turmoilExtension: true, aresExtension: true});
    turmoil = Turmoil.getTurmoil(game);
  });

  it('resolve play', () => {
    const oceanTile = game.board.getAvailableSpacesForOcean(player)[0];
    game.addCity(player, game.board.getAdjacentSpaces(oceanTile)[0]);
    game.addOcean(player, oceanTile);
    player.megaCredits = 10;

    card.resolve(game, turmoil);

    expect(player.megaCredits).to.eq(6);
  });

  it('resolve play with overplaced tiles', () => {
    [game, player] = testGame(2, {aresExtension: true, turmoilExtension: true});

    // Find two adjacent ocean spaces
    function adjacentOceans(): {first: Space, second: Space} {
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

    game.addOcean(player, spaces.first);
    game.addOcean(player, spaces.second);

    // Add an ocean city on top of the second ocean.
    const tile = {
      tileType: TileType.OCEAN_CITY,
      covers: spaces.second.tile,
    };
    player.game.addTile(player, spaces.second, tile);

    player.megaCredits = 10;

    card.resolve(game, turmoil);

    expect(player.megaCredits).to.eq(6);
  });
});
