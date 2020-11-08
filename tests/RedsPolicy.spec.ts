import { expect } from "chai";
import { Color } from "../src/Color";
import { Player } from "../src/Player";
import { Game, GameOptions } from "../src/Game";
import { LavaFlows } from "../src/cards/LavaFlows";
import { IceAsteroid } from "../src/cards/IceAsteroid";
import { ProtectedValley } from "../src/cards/ProtectedValley";
import { SpaceType } from "../src/SpaceType";
import { TileType } from "../src/TileType";
import { resetBoard, getSpaceById, setCustomGameOptions } from "./TestingUtils";
import { ActionDetails, RedsPolicy } from "../src/turmoil/RedsPolicy";

describe("RedsPolicy", function () {
    let player : Player, game : Game, iceAsteroid: ActionDetails, protectedValley: ActionDetails, lavaFlows: ActionDetails;

    beforeEach(function() {
        player = new Player("test", Color.BLUE, false);
        const gameOptions = setCustomGameOptions() as GameOptions;
        game = new Game("foobar", [player], player, gameOptions);
        resetBoard(game);
        protectedValley = new ActionDetails({
            card: new ProtectedValley(),
            oxygenIncrease: 1,
            nonOceanToPlace: TileType.GREENERY,
            megaCreditsProduction: 2
        });
        iceAsteroid = new ActionDetails({
            card: new IceAsteroid(),
            oceansToPlace: 2,
            oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player),
        });
        lavaFlows = new ActionDetails({
            card: new LavaFlows(),
            temperatureIncrease: 2,
            nonOceanToPlace: TileType.LAVA_FLOWS,
            nonOceanAvailableSpaces: LavaFlows.getVolcanicSpaces(player, game)
        });
    });

    it("Should work", function() {
        // Playing Protected Valley costs 23 + 3 = 26
        // Playing Ice Asteroid costs 23 + 3*2 = 29

        player.megaCredits = 23;
        expect(RedsPolicy.canAffordRedsPolicy(player, game, protectedValley, true).canAfford).is.false;
        expect(RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true).canAfford).is.false;

        player.megaCredits = 26;
        expect(RedsPolicy.canAffordRedsPolicy(player, game, protectedValley, true).canAfford).is.true;
        expect(RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true).canAfford).is.false;

        player.megaCredits = 29;
        expect(RedsPolicy.canAffordRedsPolicy(player, game, protectedValley, true).canAfford).is.true;
        expect(RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true).canAfford).is.true;
    });

    it("Should work whith placement bonus", function() {
        player.megaCredits = 27;

        // Can gain 2 MC from placing the 2nd ocean next to the first one
        const test = RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true);
        expect(test.canAfford).is.true;
        expect(test.spaces!.size).to.be.gte(1);

    });

    it("Should work with Lava Flows", function() {
        player.megaCredits = 22;
        expect(RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows).canAfford).is.false;


        player.megaCredits = 25;
        expect(RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows).canAfford).is.true;

        
        (game as any).temperature = -2;
        const test3 = RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows); // 18 + 3*3
        expect(test3.canAfford).is.true;
        const spaces = test3.spaces!;
        const ocean04 = getSpaceById(game, "04");
        const tharsisThollus = getSpaceById(game, "09");
        expect(spaces).has.lengthOf(1);
        expect(spaces.has(ocean04)).is.true;
        expect(spaces.get(ocean04) as any).has.lengthOf(1);
        expect((spaces.get(ocean04) as any).has(tharsisThollus)).is.true;


        // Placing a greenery on 04
        game.addGreenery(player, "04", SpaceType.OCEAN, false);
        expect(RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows).canAfford).is.false;
    });
});
