import {MarketingExperts} from '../../../src/server/cards/ares/MarketingExperts';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {expect} from 'chai';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {TestPlayer} from '../../TestPlayer';

describe('MarketingExperts', function() {
  let card: MarketingExperts;
  let player: Player;
  let otherPlayer: Player;
  let game: Game;

  beforeEach(function() {
    card = new MarketingExperts();
    player = TestPlayer.BLUE.newPlayer();
    otherPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    game.board = EmptyBoard.newInstance();
  });

  it('Play', function() {
    expect(player.production.megacredits).eq(0);
    card.play(player);
    expect(player.production.megacredits).eq(1);
  });

  // This doesn't test anything about this card, but about the behavior this card provides, from
  // AresHandler.
  it('Bonus in the field', function() {
    // tile types in this test are irrelevant.
    player.playedCards = [card];

    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [SpaceBonus.DRAW_CARD]};
    game.addTile(player, SpaceType.LAND, firstSpace, {tileType: TileType.RESTRICTED_AREA});

    expect(player.megaCredits).is.eq(0);
    expect(otherPlayer.megaCredits).is.eq(0);

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(otherPlayer, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});

    expect(player.megaCredits).is.eq(2);
    expect(otherPlayer.megaCredits).is.eq(0);
  });
});
