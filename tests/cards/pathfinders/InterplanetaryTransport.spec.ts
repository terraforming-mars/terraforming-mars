import {expect} from 'chai';
import {InterplanetaryTransport} from '../../../src/server/cards/pathfinders/InterplanetaryTransport';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TileType} from '../../../src/common/TileType';
import {SpaceName} from '../../../src/server/SpaceName';

describe('InterplanetaryTransport', function() {
  let card: InterplanetaryTransport;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new InterplanetaryTransport();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('play - cities on land yield nothing', function() {
    const landSpaces = game.board.getAvailableSpacesOnLand(player);
    for (const space of landSpaces) {
      game.simpleAddTile(player, space, {tileType: TileType.CITY});
      card.play(player);
      expect(player.production.megacredits).eq(0);
    }
  });

  it('play - greeneries in space yield nothing', function() {
    game.simpleAddTile(player, game.board.getSpace(SpaceName.STANFORD_TORUS), {tileType: TileType.GREENERY});
    card.play(player);
    expect(player.production.megacredits).eq(0);
  });

  it('play - cities in space yield money', function() {
    game.simpleAddTile(player, game.board.getSpace(SpaceName.STANFORD_TORUS), {tileType: TileType.CITY});
    card.play(player);
    expect(player.production.megacredits).eq(1);
  });
});
