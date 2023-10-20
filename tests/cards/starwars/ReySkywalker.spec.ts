import {expect} from 'chai';
import {ReySkywalker} from '../../../src/server/cards/starwars/ReySkywalker';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('ReySkywalker', () => {
  let card: ReySkywalker;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new ReySkywalker();
    [game, player] = testGame(2, {starWarsExpansion: true});
  });

  it('Play', () => {
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
});
