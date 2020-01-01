
import { expect } from "chai";
import { MiningArea } from "../../src/cards/MiningArea";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { SpaceBonus } from "../../src/SpaceBonus";
import { TileType } from "../../src/TileType";
import { Resources } from '../../src/Resources';

describe("MiningArea", function () {
    it("Can't play", function () {
        const card = new MiningArea();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MiningArea();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const lands = game.getAvailableSpacesOnLand(player);
        for (let land of lands) {
            if (land.bonus.indexOf(SpaceBonus.STEEL) !== -1 || land.bonus.indexOf(SpaceBonus.TITANIUM) !== -1) {
                const adjacents = game.getAdjacentSpaces(land);
                for (let adjacent of adjacents) {
                    if (adjacent.tile === undefined && adjacent.bonus.length === 0) {
                        game.addTile(player, adjacent.spaceType, adjacent, { tileType: TileType.SPECIAL });
                    }
                }
            }
        }
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        const titaniumSpace = action.availableSpaces.find((space) => space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1 && space.bonus.indexOf(SpaceBonus.STEEL) === -1);
        expect(titaniumSpace).not.to.eq(undefined);
        action.cb(titaniumSpace!);
        expect(titaniumSpace!.player).to.eq(player);
        expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).to.eq(TileType.SPECIAL);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1); 
        const steelSpace = action.availableSpaces.find((space) => space.bonus.indexOf(SpaceBonus.TITANIUM) === -1 && space.bonus.indexOf(SpaceBonus.STEEL) !== -1);
        expect(steelSpace).not.to.eq(undefined);
        action.cb(steelSpace!);
        expect(steelSpace!.player).to.eq(player);
        expect(steelSpace!.tile && steelSpace!.tile!.tileType).to.eq(TileType.SPECIAL);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1); 
    });
});
