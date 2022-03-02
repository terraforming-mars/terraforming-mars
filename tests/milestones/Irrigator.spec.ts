import {Game} from "@/Game";
import {Irrigator} from "@/milestones/Irrigator";
import {Player} from "@/Player";
import {expect} from "chai";
import {TestingUtils} from "tests/TestingUtils";
import {TestPlayers} from "tests/TestPlayers";

describe('Irrigator', () => {
  let milestone : Irrigator; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    milestone = new Irrigator();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('test', [player, player2], player);

    TestingUtils.maxOutOceans(player);
  });

  it('Can claim with 4 tiles adjacent to oceans', () => {
    game.addCityTile(player, '09');
    game.addGreenery(player, '20'); 
    game.addCityTile(player, '11');
    game.addGreenery(player, '24');
    expect(milestone.canClaim(player)).is.true;
  });
});