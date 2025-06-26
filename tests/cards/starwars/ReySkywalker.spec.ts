import {expect} from 'chai';
import {ReySkywalker} from '../../../src/server/cards/starwars/ReySkywalker';
import {testGame} from '../../TestGame';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {HAZARD_TILES, TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {intersection} from '../../../src/common/utils/utils';

describe('ReySkywalker', () => {
  it('Play', () => {
    const card = new ReySkywalker();
    const [game, player] = testGame(2, {starWarsExpansion: true});

    maxOutOceans(player);

    // Pick a tile next to an ocean to show that the player does not gain the 2MC bonus.
    const space = player.game.board.getAvailableSpacesOnLand(player)
      .filter((space) => player.game.board.getAdjacentSpaces(space)
        .some((s) => s.tile?.tileType === TileType.OCEAN))[0];

    expect(space.bonus).deep.eq([SpaceBonus.STEEL, SpaceBonus.STEEL]);
    player.megaCredits = 0;
    player.steel = 0;

    const selectSpace = cast(card.play(player), SelectSpace);
    selectSpace.cb(space);
    runAllActions(player.game);

    // Player doesn't get the placement bonus either.
    expect(player.steel).eq(0);
    expect(player.megaCredits).eq(0);
    expect(game.board.getAvailableSpacesOnLand(player).map((s) => s.id)).not.contains(space.id);
  });

  it('Cannot play on Hazard tiles', () => {
    const card = new ReySkywalker();
    const [game, player] = testGame(2, {starWarsExpansion: true, aresExtension: true});

    player.megaCredits = 8; // Necessary for this test to be valid due to hazard costs.

    const hazardSpaces = game.board.spaces.filter((space) => space.tile?.tileType && HAZARD_TILES.has(space.tile?.tileType));
    expect(hazardSpaces).has.lengthOf(3);
    const {spaces} = cast(card.play(player), SelectSpace);
    expect(spaces).has.lengthOf(45);
    expect(intersection(spaces, hazardSpaces)).is.empty;
  });
});
