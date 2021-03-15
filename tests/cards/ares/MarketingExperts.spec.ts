import {MarketingExperts} from '../../../src/cards/ares/MarketingExperts';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {expect} from 'chai';
import {SpaceType} from '../../../src/SpaceType';
import {TileType} from '../../../src/TileType';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {TestPlayers} from '../../TestPlayers';

describe('MarketingExperts', function() {
  let card : MarketingExperts; let player : Player; let otherPlayer: Player; let game : Game;

  beforeEach(function() {
    card = new MarketingExperts();
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    game.board = EmptyBoard.newInstance();
  });

  it('Play', function() {
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
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
