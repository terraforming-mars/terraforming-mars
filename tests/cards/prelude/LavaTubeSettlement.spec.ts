import {expect} from 'chai';
import {LavaTubeSettlement} from '../../../src/server/cards/prelude/LavaTubeSettlement';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {SpaceName} from '../../../src/server/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {cast, resetBoard} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('LavaTubeSettlement', function() {
  let card: LavaTubeSettlement;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new LavaTubeSettlement();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    resetBoard(game);
  });

  it('Cannot play without energy production', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Cannot play if no volcanic spaces left', function() {
    player.production.add(Resources.ENERGY, 1);
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.THARSIS_THOLUS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.ARSIA_MONS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.PAVONIS_MONS), {tileType: TileType.LAVA_FLOWS});

    const anotherPlayer = TestPlayer.RED.newPlayer();
    game.board.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim

    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    const selectSpace = cast(game.deferredActions.peek()!.execute(), SelectSpace);
    selectSpace.cb(selectSpace.availableSpaces[0]);

    expect(selectSpace.availableSpaces[0].tile && selectSpace.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(selectSpace.availableSpaces[0].player).to.eq(player);
    expect(player.production.energy).to.eq(0);
  });
});
