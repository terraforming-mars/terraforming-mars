import {expect} from 'chai';
import {UndergroundSettlement} from '../../../src/server/cards/underworld/UndergroundSettlement';
import {testGame} from '../../TestGame';
import {addCity, cast, churn, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {assertIsClaimAction} from '../../underworld/underworldAssertions';

describe('UndergroundSettlement', () => {
  it('play', () => {
    const card = new UndergroundSettlement();
    const [game, player] = testGame(2, {underworldExpansion: true});

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);
    const space = selectSpace.spaces[0];

    expect(space.id).eq('03');
    expect(player.game.board.getSpaceOrThrow('04').undergroundResources).is.undefined;
    expect(player.game.board.getSpaceOrThrow('08').undergroundResources).is.undefined;
    expect(player.game.board.getSpaceOrThrow('09').undergroundResources).is.undefined;

    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.player).eq(player);

    expect(player.game.board.getSpaceOrThrow('04').undergroundResources).is.not.undefined;
    expect(player.game.board.getSpaceOrThrow('08').undergroundResources).is.not.undefined;
    expect(player.game.board.getSpaceOrThrow('09').undergroundResources).is.not.undefined;

    runAllActions(game);

    assertIsClaimAction(player, player.popWaitingFor());
  });

  // #7073
  it('excavation rules about adjacency should not apply.', () => {
    const card = new UndergroundSettlement();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    const firstSpace = player.game.board.getAvailableSpacesForCity(player)[0];
    addCity(player, firstSpace.id);

    expect(player.canPlay(card)).is.true;
  });
});
