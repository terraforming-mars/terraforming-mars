import {expect} from 'chai';
import {InterplanetaryTransport} from '../../../src/server/cards/pathfinders/InterplanetaryTransport';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {TileType} from '../../../src/common/TileType';
import {SpaceName} from '../../../src/common/boards/SpaceName';

describe('InterplanetaryTransport', () => {
  let card: InterplanetaryTransport;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new InterplanetaryTransport();
    [game, player] = testGame(1);
  });

  it('play - cities on land yield nothing', () => {
    const landSpaces = game.board.getAvailableSpacesOnLand(player);
    for (const space of landSpaces) {
      game.simpleAddTile(player, space, {tileType: TileType.CITY});
      card.play(player);
      expect(player.production.megacredits).eq(0);
    }
  });

  it('play - greeneries in space yield nothing', () => {
    game.simpleAddTile(player, game.board.getSpaceOrThrow(SpaceName.GANYMEDE_COLONY), {tileType: TileType.GREENERY});
    card.play(player);
    expect(player.production.megacredits).eq(0);
  });

  it('play - cities in space yield money', () => {
    game.simpleAddTile(player, game.board.getSpaceOrThrow(SpaceName.GANYMEDE_COLONY), {tileType: TileType.CITY});
    card.play(player);
    expect(player.production.megacredits).eq(1);
  });
});
