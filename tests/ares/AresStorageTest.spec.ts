import { Color } from "../../src/Color";
import { Game } from "../../src/Game";
import { Player } from "../../src/Player";
import { ARES_OPTIONS_NO_HAZARDS } from "./AresTestHelper";
import { SpaceType } from "../../src/SpaceType";
import { expect } from "chai";
import { SerializedGame } from "../../src/SerializedGame";
import { TileType } from "../../src/TileType";

describe("AresStorageTest", function () {
    it("When reloading the board, covered spaces don't have bonuses.", function() {
        var player = new Player("test", Color.BLUE, false);
        var otherPlayer = new Player("other", Color.RED, false);
        var game = new Game("foobar", [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
        var space = game.board.getSpaces(SpaceType.OCEAN).find(space => space.bonus.length > 0)!;
        var spaceId = space.id;

        expect(space.bonus.length).is.greaterThan(0);
        game.addOceanTile(player, spaceId);
        expect(space.bonus.length).is.eq(0);

        var json = JSON.stringify(game, game.replacer);
        var serializedGame: SerializedGame = JSON.parse(json);

        var game2 = new Game("unrelated_id", [player, otherPlayer], player);
        game2.loadFromJSON(serializedGame);
        var space2 = game2.getSpace(space.id);

        // This would be more compelling if it were a greenery placed over a hazard, and the player
        // remained.
        expect(space2.bonus).is.empty;
        expect(space2.tile).is.not.undefined;
        expect(space2.tile!.tileType).eq(TileType.OCEAN);
    })

    it("When reloading the board without Ares, covered spaces keep their bonuses.", function() {
        var player = new Player("test", Color.BLUE, false);
        var otherPlayer = new Player("other", Color.RED, false);
        var game = new Game("foobar", [player, otherPlayer], player); // This is the difference - normal options without Ares.

        var space = game.board.getSpaces(SpaceType.OCEAN).find(space => space.bonus.length > 0)!;
        var spaceId = space.id;

        expect(space.bonus.length).is.greaterThan(0);
        game.addOceanTile(player, spaceId);
        expect(space.bonus.length).is.greaterThan(0);

        var json = JSON.stringify(game, game.replacer);
        var serializedGame: SerializedGame = JSON.parse(json);

        var game2 = new Game("unrelated_id", [player, otherPlayer], player);
        game2.loadFromJSON(serializedGame);
        var space2 = game2.getSpace(space.id);

        // This would be more compelling if it were a greenery placed over a hazard, and the player
        // remained.
        expect(space.bonus.length).is.greaterThan(0);
        expect(space2.tile).is.not.undefined;
        expect(space2.tile!.tileType).eq(TileType.OCEAN);
    })

})