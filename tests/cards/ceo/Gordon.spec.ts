import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {testGame} from '../../TestGame';
import {addGreenery, addCity, runAllActions} from '../../TestingUtils';
import {Gordon} from '../../../src/server/cards/ceos/Gordon';

describe('Gordon', function() {
  let card: Gordon;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Gordon();
    [game, player, player2] = testGame(2);
    player.playedCards.push(card);
  });

  it('Can place greenery tile on any available land space, not just adjacent to exising greenery', function() {
    addGreenery(player, '35');
    expect(game.board.getAvailableSpacesForGreenery(player).length).greaterThan(6);
  });

  it('Can place cities next to other cities', function() {
    const board = game.board;
    const space = board.getSpaceOrThrow('35');
    addCity(player, space.id);
    const availableSpacesForCity = board.getAvailableSpacesForCity(player);
    const spacesNextToCity = board.getAdjacentSpaces(space);
    expect(availableSpacesForCity).includes(spacesNextToCity[0]);
  });

  it('Gains 2 MC when placing city or greenery tile', function() {
    player.megaCredits = 0;
    addGreenery(player, '35');
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(2);
    addCity(player, '37');
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(4);
  });

  it('Does not give MC production for city off Mars', function() {
    game.addTile(player, game.board.spaces.find((space) => space.spaceType === SpaceType.COLONY)!, {
      tileType: TileType.CITY,
    });
    runAllActions(game);
    expect(player.megaCredits).to.eq(0);
  });

  it('Does not gain MC when opponent places city or greenery tile', function() {
    player.megaCredits = 0;
    addGreenery(player2, '35');
    runAllActions(game);
    expect(player.megaCredits).eq(0);
  });
});
