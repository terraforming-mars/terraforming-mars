import {expect} from 'chai';
import {LavaTubeSettlement} from '../../../src/server/cards/prelude/LavaTubeSettlement';
import {Resource} from '../../../src/common/Resource';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {assertPlaceCity} from '../../assertions';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {toID} from '../../../src/common/utils/utils';

describe('LavaTubeSettlement', () => {
  let card: LavaTubeSettlement;

  beforeEach(() => {
    card = new LavaTubeSettlement();
  });

  it('Cannot play without energy production', () => {
    const [/* game */, player] = testGame(2);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if no volcanic spaces left', () => {
    const [game, player, otherPlayer] = testGame(2);
    player.production.add(Resource.ENERGY, 1);
    game.addTile(player, game.board.getSpaceOrThrow(SpaceName.THARSIS_THOLUS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, game.board.getSpaceOrThrow(SpaceName.ARSIA_MONS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, game.board.getSpaceOrThrow(SpaceName.PAVONIS_MONS), {tileType: TileType.LAVA_FLOWS});

    game.board.getSpaceOrThrow(SpaceName.ASCRAEUS_MONS).player = otherPlayer; // land claim

    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    const [game, player] = testGame(2);
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace.spaces.map(toID)).to.have.members(game.board.volcanicSpaceIds);
    assertPlaceCity(player, selectSpace);
  });

  it('Play on Hellas', () => {
    const [game, player] = testGame(2, {boardName: BoardName.HELLAS});
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace.spaces.map(toID)).to.have.members(game.board.getAvailableSpacesForCity(player).map(toID));
  });

  it('Play on Utopia Planitia', () => {
    const [game, player] = testGame(2, {boardName: BoardName.UTOPIA_PLANITIA});
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace.spaces.map(toID)).to.have.members(game.board.getAvailableSpacesForCity(player).map(toID));
  });
});
