import { expect } from "chai";
import { Color } from "../src/Color";
import { OriginalBoard } from "../src/OriginalBoard";
import { Player } from "../src/Player";
import { TileType } from "../src/TileType";
import { ISpace } from "../src/ISpace";

describe("Board", function () {
    let board : OriginalBoard, player : Player, player2 : Player;

    beforeEach(function() {
        board = new OriginalBoard();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("foo", Color.RED, false);
    });

    it("Can have greenery placed on any available land when player has no tile placed", function () {
        const availableSpaces = board.getAvailableSpacesForGreenery(player);
        expect(availableSpaces.length).to.eq(board.getAvailableSpacesOnLand(player).length);
    });

    it("Can have greenery placed on any available land when player has a tile placed that is land locked", function () {
        board.spaces[2].player = player;
        board.spaces[2].tile = { tileType: TileType.GREENERY };
        board.spaces[7].player = player2;
        board.spaces[7].tile = { tileType: TileType.GREENERY };
        board.spaces[8].player = player2;
        board.spaces[8].tile = { tileType: TileType.GREENERY };
        const availableSpaces = board.getAvailableSpacesForGreenery(player);
        expect(availableSpaces.length).to.eq(board.getAvailableSpacesOnLand(player).length);
    });

    it("Can only place greenery adjacent to a tile a player owns", function () {
        board.spaces[2].player = player;
        board.spaces[2].tile = { tileType: TileType.GREENERY };
        board.spaces[7].player = player2;
        board.spaces[7].tile = { tileType: TileType.GREENERY };
        const availableSpaces = board.getAvailableSpacesForGreenery(player);
        expect(availableSpaces.length).to.eq(1);
    });
    
    it("doesnt block node process when bug with getRandomCitySpace", function () {
        (board as any).canPlaceTile = function () { return false; };
        expect(function () { board.getRandomCitySpace(0); }).to.throw("space not found for getRandomCitySpace");
    });

    function expectSpace(space: ISpace, id: string, x: number, y: number) {
        if (id !== space.id || x !== space.x || y !== space.y) {
            expect.fail(`space ${space.id} at (${space.x}, ${space.y}) does not match [${id}, ${x}, ${y}]`);
        }
    }

    it("getAvailableSpaceByOffset positive", function() {
        // First two rows look like this:
        //  - o - o o      - means land
        // - - - - - o     o means ocean
        // This will skip ocean spaces.

        expectSpace(board.getAvailableSpaceByOffset(0, 1), "03", 4, 0);
        expectSpace(board.getAvailableSpaceByOffset(1, 1), "05", 6, 0);
        expectSpace(board.getAvailableSpaceByOffset(2, 1), "08", 3, 1);
        expectSpace(board.getAvailableSpaceByOffset(3, 1), "09", 4, 1);
    });

    it("Get available space by offset negative", function() {
        // Last two rows look like this:
        // - - - - - -    - means land
        //  - - - - o     o means ocean

      expectSpace(board.getAvailableSpaceByOffset(0, -1), "62", 7, 8);
        expectSpace(board.getAvailableSpaceByOffset(1, -1), "61", 6, 8);
        expectSpace(board.getAvailableSpaceByOffset(2, -1), "60", 5, 8);
        expectSpace(board.getAvailableSpaceByOffset(3, -1), "59", 4, 8);
    });

    it("getAvailableSpaceByOffset skips tiles", function() {
        var space = board.getAvailableSpaceByOffset(2, 1);
        expectSpace(board.getAvailableSpaceByOffset(2, 1), "08", 3, 1);
        space.tile = { tileType: TileType.GREENERY };
        expectSpace(board.getAvailableSpaceByOffset(2, 1), "09", 4, 1);
    });

    it("getAvailableSpaceByOffset skips hazard tiles", function() {
        var space = board.getAvailableSpaceByOffset(2, 1);
        expectSpace(board.getAvailableSpaceByOffset(2, 1), "08", 3, 1);
        space.tile = { tileType: TileType.DUST_STORM_MILD, hazard: true };
        expectSpace(board.getAvailableSpaceByOffset(2, 1), "09", 4, 1);
    });
});
