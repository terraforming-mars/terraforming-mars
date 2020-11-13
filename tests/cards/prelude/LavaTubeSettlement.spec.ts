import {expect} from 'chai';
import {LavaTubeSettlement} from '../../../src/cards/prelude/LavaTubeSettlement';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {SpaceName} from '../../../src/SpaceName';
import {SpaceType} from '../../../src/SpaceType';
import {Resources} from '../../../src/Resources';
import {resetBoard} from '../../TestingUtils';
import {SelectSpace} from '../../../src/inputs/SelectSpace';

describe('LavaTubeSettlement', function() {
  let card : LavaTubeSettlement; let player : Player; let game : Game;

  beforeEach(function() {
    card = new LavaTubeSettlement();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player], player);
    resetBoard(game);
  });

  after(function() {
    resetBoard(game);
  });

  it('Can\'t play without energy production', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if no volcanic spaces left', function() {
    player.addProduction(Resources.ENERGY);
    game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.THARSIS_THOLUS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.ARSIA_MONS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.PAVONIS_MONS), {tileType: TileType.LAVA_FLOWS});

    const anotherPlayer = new Player('test', Color.RED, false);
    game.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim

    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    const selectSpace = game.deferredActions.next()!.execute() as SelectSpace;
    selectSpace.cb(selectSpace.availableSpaces[0]);

    expect(selectSpace.availableSpaces[0].tile && selectSpace.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(selectSpace.availableSpaces[0].player).to.eq(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
  });
});
