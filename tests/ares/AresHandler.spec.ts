// Simple sanity test for the moment.

import { expect } from "chai";
import { AresHandler } from "../../src/ares/AresHandler";
import { SpaceBonus } from "../../src/SpaceBonus";
import { AresSpaceBonus } from "../../src/ares/AresSpaceBonus";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Color } from "../../src/Color";
import { ARES_GAME_OPTIONS } from "./AresTestHelper";
import { EmptyBoard } from "./EmptyBoard";
import { TileType } from "../../src/TileType";
import { ITile } from "../../src/ITile";
import { SpaceType } from "../../src/SpaceType";


// TODO(kberg): remaining tests.
// Pay adjacency costs
// pay hazard costs
// Place tile over hazard

describe("AresHandler", function () {
    let player : Player, otherPlayer: Player, game : Game;

    beforeEach(function() {
      player = new Player("test", Color.BLUE, false);
      otherPlayer = new Player("other", Color.RED, false);
      game = new Game("foobar", [player, otherPlayer], player, ARES_GAME_OPTIONS);
      game.board = new EmptyBoard();
    });
  
  
    it("NotIsAresSpaceBonus", function () {
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.TITANIUM)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.STEEL)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.PLANT)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.DRAW_CARD)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.HEAT)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.OCEAN)).is.false;
    });
    it("IsAresSpaceBonus", function () {
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.ANIMAL)).is.true;
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.MEGACREDITS)).is.true;
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.MICROBE)).is.true;
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.POWER)).is.true;
    });

    it("Get adjacency bonus", function() {
        var firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
        firstSpace.adjacency = { bonus: [ SpaceBonus.DRAW_CARD ] };
        game.addTile(otherPlayer, SpaceType.LAND, firstSpace, {tileType: TileType.RESTRICTED_AREA});
        
        player.megaCredits = 0;
        player.cardsInHand = [];
        otherPlayer.megaCredits = 0;
        otherPlayer.cardsInHand = [];

        var adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
        game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});

        // player who placed next to Restricted area gets a card, but no money.
        expect(player.megaCredits).is.eq(0);
        expect(player.cardsInHand).is.length(1);

        // player who owns Restricted area gets money, but no card.
        expect(otherPlayer.megaCredits).is.eq(1);
        expect(otherPlayer.cardsInHand).is.length(0);
    });

    it("setupHazards", function() {
        // front-load the deck with cards of predtermined costs.
        // four player game places two dust storms.

        // Even though there's already a game, with a board, that laid out hazards, this is going to use a clean set-up.

        var deck = game.dealer.deck;
        deck[deck.length - 1].cost = 5;
        deck[deck.length - 2].cost = 3;
        game.board.spaces.forEach(space => { space.tile = undefined; space.player = undefined });

        AresHandler.setupHazards(game, 4);

        interface SpaceToTest {
            tile: ITile;
            x: number;
            y: number;
        }
        var spacesWithTiles: Array<SpaceToTest> = game.board.spaces
            .filter(space => space.tile !== undefined)
            .map(space => {var x: SpaceToTest = {tile: space.tile!, x: space.x, y: space.y}; return x});

        expect(spacesWithTiles).to.deep.eq([
            {tile: {tileType: TileType.DUST_STORM_MILD, hazard: true}, x: 8, y: 0},
            {tile: {tileType: TileType.DUST_STORM_MILD, hazard: true}, x: 6, y: 8}]);
   });
});