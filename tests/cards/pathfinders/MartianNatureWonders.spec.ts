import {expect} from 'chai';
import {MartianNatureWonders} from '../../../src/server/cards/pathfinders/MartianNatureWonders';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('MartianNatureWonders', () => {
  let card: MartianNatureWonders;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MartianNatureWonders();
    [game, player] = testGame(2);
  });

  it('play', () => {
    const dataCard = new LunarObservationPost();
    player.playedCards.push(dataCard);
    expect(dataCard.resourceCount).eq(0);

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

    expect(player.steel).eq(2);
    expect(player.megaCredits).eq(0);
    expect(game.board.getAvailableSpacesOnLand(player).map((s) => s.id)).not.contains(space.id);
    expect(dataCard.resourceCount).eq(2);
  });
});
