import {expect} from 'chai';
import {RareEarthElements} from '../../../src/cards/pathfinders/RareEarthElements';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {TileType} from '../../../src/TileType';
import {Resources} from '../../../src/Resources';

describe('RareEarthElements', function() {
  let card: RareEarthElements;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RareEarthElements();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('play', function() {
    const spaces = player.game.board.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, spaces[0], {tileType: TileType.COMMERCIAL_DISTRICT});
    player.setProductionForTest({megacredits: 0});
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);

    // Cities won't doesn't change this card's reward.
    game.simpleAddTile(player, spaces[1], {tileType: TileType.CITY});
    player.setProductionForTest({megacredits: 0});
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);

    // Ocean City is supposed to be on an ocean but that doesn't matter for this test.
    game.simpleAddTile(player, spaces[2], {tileType: TileType.OCEAN_CITY});
    player.setProductionForTest({megacredits: 0});
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);

    // Greenery won't doesn't change this card's reward.
    game.simpleAddTile(player, spaces[3], {tileType: TileType.GREENERY});
    player.setProductionForTest({megacredits: 0});
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);

    // Other player's special tile doesn't change this card's reward.
    game.simpleAddTile(player2, spaces[3], {tileType: TileType.LAVA_FLOWS});
    player.setProductionForTest({megacredits: 0});
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);

    game.simpleAddTile(player, spaces[4], {tileType: TileType.MINING_AREA});
    player.setProductionForTest({megacredits: 0});
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);
  });
});
