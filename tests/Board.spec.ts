import { expect } from "chai";
import { Color } from "../src/Color";
import { OriginalBoard } from "../src/OriginalBoard";
import { Player } from "../src/Player";
import { TileType } from "../src/TileType";
import { Game } from "../src/Game";

describe("Board", function () {
    it("Can have greenery placed on any available land when player has no tile placed", function () {
        const board = new OriginalBoard();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const availableSpaces = board.getAvailableSpacesForGreenery(player, game);
        expect(availableSpaces.length).to.eq(board.getAvailableSpacesOnLand(player, game).length);
    });
    it("Can have greenery placed on any available land when player has a tile placed that is land locked", function () {
        const board = new OriginalBoard();
        const player1 = new Player("test", Color.BLUE, false);
        const player2 = new Player("foo", Color.RED, false);
        const game = new Game("foobar", [player1, player2], player1);
        board.spaces[2].player = player1;
        board.spaces[2].tile = { tileType: TileType.GREENERY };
        board.spaces[7].player = player2;
        board.spaces[7].tile = { tileType: TileType.GREENERY };
        board.spaces[8].player = player2;
        board.spaces[8].tile = { tileType: TileType.GREENERY };
        const availableSpaces = board.getAvailableSpacesForGreenery(player1, game);
        expect(availableSpaces.length).to.eq(board.getAvailableSpacesOnLand(player1, game).length);
    });
    it("Can only place greenery adjacent to a tile a player owns", function () {
        const board = new OriginalBoard();
        const player1 = new Player("test", Color.BLUE, false);
        const player2 = new Player("foo", Color.RED, false);
        const game = new Game("foobar", [player1, player2], player1);
        board.spaces[2].player = player1;
        board.spaces[2].tile = { tileType: TileType.GREENERY };
        board.spaces[7].player = player2;
        board.spaces[7].tile = { tileType: TileType.GREENERY };
        const availableSpaces = board.getAvailableSpacesForGreenery(player1, game);
        expect(availableSpaces.length).to.eq(1);
    });
    it("doesnt block node process when bug with getRandomCitySpace", function () {
        const board = new OriginalBoard();
        (board as any).canPlaceTile = function () { return false; };
        expect(function () { board.getRandomCitySpace(0); }).to.throw("space not found for getRandomCitySpace");
    });
});
