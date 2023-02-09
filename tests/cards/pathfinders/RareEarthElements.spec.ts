import {expect} from 'chai';
import {RareEarthElements} from '../../../src/server/cards/pathfinders/RareEarthElements';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {LandClaim} from '../../../src/server/cards/base/LandClaim';
import {AresHandler} from '../../../src/server/ares/AresHandler';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('RareEarthElements', function() {
  let card: RareEarthElements;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RareEarthElements();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('play', function() {
    const spaces = player.game.board.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, spaces[0], {tileType: TileType.COMMERCIAL_DISTRICT});
    player.production.override({megacredits: 0});
    card.play(player);
    expect(player.production.megacredits).eq(1);

    // Cities won't doesn't change this card's reward.
    game.simpleAddTile(player, spaces[1], {tileType: TileType.CITY});
    player.production.override({megacredits: 0});
    card.play(player);
    expect(player.production.megacredits).eq(1);

    // Ocean City is supposed to be on an ocean but that doesn't matter for this test.
    game.simpleAddTile(player, spaces[2], {tileType: TileType.OCEAN_CITY});
    player.production.override({megacredits: 0});
    card.play(player);
    expect(player.production.megacredits).eq(2);

    // Greenery won't doesn't change this card's reward.
    game.simpleAddTile(player, spaces[3], {tileType: TileType.GREENERY});
    player.production.override({megacredits: 0});
    card.play(player);
    expect(player.production.megacredits).eq(2);

    // Other player's special tile doesn't change this card's reward.
    game.simpleAddTile(player2, spaces[3], {tileType: TileType.LAVA_FLOWS});
    player.production.override({megacredits: 0});
    card.play(player);
    expect(player.production.megacredits).eq(2);

    game.simpleAddTile(player, spaces[4], {tileType: TileType.MINING_AREA});
    player.production.override({megacredits: 0});
    card.play(player);
    expect(player.production.megacredits).eq(3);
  });

  it('You do not own hazards you land-claimed', () => {
    const game = newTestGame(1, {aresExtension: true, pathfindersExpansion: true});
    const player = getTestPlayer(game, 0);
    const hazardSpace = game.board.spaces.filter(AresHandler.hasHazardTile)[0];
    const landClaim = new LandClaim();
    player.playCard(landClaim);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace.availableSpaces).includes(hazardSpace);
    selectSpace.cb(hazardSpace);

    player.playCard(card);

    expect(player.production.megacredits).eq(0);
  });
});
