import {expect} from 'chai';
import {LavaTubeSettlement} from '../../../src/server/cards/prelude/LavaTubeSettlement';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {SpaceName} from '../../../src/server/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {resetBoard, runAllActions, testGame} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {assertPlaceCity} from '../../assertions';

describe('LavaTubeSettlement', function() {
  let card: LavaTubeSettlement;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new LavaTubeSettlement();
    [game, player] = testGame(1);
    resetBoard(game);
  });

  it('Cannot play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if no volcanic spaces left', function() {
    player.production.add(Resource.ENERGY, 1);
    game.addTile(player, game.board.getSpaceOrThrow(SpaceName.THARSIS_THOLUS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, game.board.getSpaceOrThrow(SpaceName.ARSIA_MONS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, game.board.getSpaceOrThrow(SpaceName.PAVONIS_MONS), {tileType: TileType.LAVA_FLOWS});

    const anotherPlayer = TestPlayer.RED.newPlayer();
    game.board.getSpaceOrThrow(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim

    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    assertPlaceCity(player, player.popWaitingFor());
  });
});
