import {MarketingExperts} from '../../../src/server/cards/ares/MarketingExperts';
import {IGame} from '../../../src/server/IGame';
import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MarketingExperts', function() {
  let card: MarketingExperts;
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new MarketingExperts();
    [game, player, otherPlayer] = testGame(2, {aresExtension: true});
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
    game.addTile(player, firstSpace, {tileType: TileType.RESTRICTED_AREA});

    expect(player.megaCredits).is.eq(0);
    expect(otherPlayer.megaCredits).is.eq(0);

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(otherPlayer, adjacentSpace, {tileType: TileType.GREENERY});

    expect(player.megaCredits).is.eq(2);
    expect(otherPlayer.megaCredits).is.eq(0);
  });
});
