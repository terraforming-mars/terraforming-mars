import { expect } from "chai";
import { Capital } from "../../src/cards/Capital";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SpaceType } from "../../src/SpaceType";
import { TileType } from "../../src/TileType";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { Resources } from '../../src/Resources';
import { maxOutOceans } from "../TestingUtils";
import { Board } from "../../src/Board";

describe("Capital", function () {
    let card : Capital, player : Player, game : Game;

    beforeEach(function() {
        card = new Capital();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without energy production", function () {
        maxOutOceans(player, game);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if oceans requirement not met", function () {
        player.setProduction(Resources.ENERGY, 2);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 4; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }
        player.setProduction(Resources.ENERGY,2);
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);

        const citySpace = game.board.getAdjacentSpaces(oceanSpaces[0])[0];
        expect(citySpace.spaceType).to.eq(SpaceType.LAND); 
        action.cb(citySpace);
        
        expect(citySpace.tile).not.to.eq(undefined);
        expect(citySpace.player).to.eq(player);
        expect(citySpace.tile && citySpace.tile.tileType).to.eq(TileType.CAPITAL);
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(0);
        expect(card.getVictoryPoints(player, game)).to.eq(1);
    });

    it("Capital special tile counts as a city", function () {
        const space = game.board.getRandomCitySpace(0);
        game.addTile(player, SpaceType.LAND, space, {
            tileType: TileType.CAPITAL,
            card: card.name
        });

        // cover main functions
        expect(Board.isCitySpace(space)).to.eq(true);
        expect(game.getCitiesInPlayOnMars()).to.eq(1);
        expect(game.getCitiesInPlay()).to.eq(1);

        // check VP
        const greenerySpace = game.board.getAdjacentSpaces(space).find((space) => space.spaceType === SpaceType.LAND);
        game.addGreenery(player, greenerySpace!.id);
        expect(player.getVictoryPoints(game).city).to.eq(1); // 1 VP for Capital city
    });
});
