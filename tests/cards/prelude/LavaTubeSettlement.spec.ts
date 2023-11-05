import {expect} from 'chai';
import {LavaTubeSettlement} from '../../../src/server/cards/prelude/LavaTubeSettlement';
import {Game} from '../../../src/server/Game';
import {Resource} from '../../../src/common/Resource';
import {SpaceName} from '../../../src/server/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {resetBoard, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('LavaTubeSettlement', function() {
  let card: LavaTubeSettlement;
  let player: TestPlayer;
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
    player.production.add(Resource.ENERGY, 1);
    game.addTile(player, game.board.getSpace(SpaceName.THARSIS_THOLUS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, game.board.getSpace(SpaceName.ARSIA_MONS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, game.board.getSpace(SpaceName.PAVONIS_MONS), {tileType: TileType.LAVA_FLOWS});

    const anotherPlayer = TestPlayer.RED.newPlayer();
    game.board.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim

    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    runAllActions(game);

    UnderworldTestHelper.assertPlaceCity(player, player.popWaitingFor());
  });
});
