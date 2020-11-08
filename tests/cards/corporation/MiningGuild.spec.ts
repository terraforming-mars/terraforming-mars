import { expect } from "chai";
import { MiningGuild } from "../../../src/cards/corporation/MiningGuild";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { SpaceType } from "../../../src/SpaceType";
import { Resources } from "../../../src/Resources";
import { maxOutOceans } from "../../TestingUtils";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";

describe("MiningGuild", function () {
    let card : MiningGuild, player : Player, player2 : Player, game: Game;

    beforeEach(function() {
        card = new MiningGuild();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player], player);

        player.corporationCard = card;
    });

    it("Should play", function () {
        card.play(player);
        expect(player.steel).to.eq(5);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
    });

    it("Gives steel production bonus when placing tiles", function () {
        card.onTilePlaced(player, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [] });
        expect(player.getProduction(Resources.STEEL)).to.eq(0);

        card.onTilePlaced(player, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [SpaceBonus.STEEL, SpaceBonus.TITANIUM] });
        expect(player.getProduction(Resources.STEEL)).to.eq(1);

        card.onTilePlaced(player, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [SpaceBonus.STEEL] });
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
        
        card.onTilePlaced(player, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [SpaceBonus.TITANIUM] });
        expect(player.getProduction(Resources.STEEL)).to.eq(3);
    });

    it("Gives steel production bonus when placing ocean tile", function () {
        maxOutOceans(player, game); // 1 ocean with titanium and 1 with steel
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
    });

    it("Does not give bonus when other players place tiles", function () {        
        card.onTilePlaced(player2, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [SpaceBonus.TITANIUM] });
        expect(player.getProduction(Resources.STEEL)).to.eq(0);
    });

    it("Does not give bonus when other players place ocean tiles", function () {
        maxOutOceans(player2, game); // 1 ocean with titanium and 1 with steel
        expect(player.getProduction(Resources.STEEL)).to.eq(0);
    });

    it("Does not give bonus for WGT", function () {
        const oceanSpaces = game.board.getOceansTiles(true);

        oceanSpaces.forEach((space) => {
            game.addTile(player, SpaceType.OCEAN, space, { tileType: TileType.OCEAN }); 
        })

        expect(player.getProduction(Resources.STEEL)).to.eq(0);
    });
});
