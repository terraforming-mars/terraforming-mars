import {expect} from 'chai';
import {MartianNatureWonders} from '../../../src/cards/pathfinders/MartianNatureWonders';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {LunarObservationPost} from '../../../src/cards/moon/LunarObservationPost';
import {maxOutOceans, runAllActions} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';

describe('MartianNatureWonders', function() {
  let card: MartianNatureWonders;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MartianNatureWonders();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('play', function() {
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

    const selectSpace = card.play(player);
    selectSpace.cb(space);
    runAllActions(player.game);

    expect(player.steel).eq(2);
    expect(player.megaCredits).eq(0);
    expect(game.board.getAvailableSpacesOnLand(player).map((s) => s.id)).not.contains(space.id);
    expect(dataCard.resourceCount).eq(2);
  });
});
