
import { expect } from "chai";
import { MiningRights } from "../../src/cards/MiningRights";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { SpaceBonus } from "../../src/SpaceBonus";
import { TileType } from "../../src/TileType";
import { Resources } from '../../src/Resources';

describe("MiningRights", function () {
    it("Should throw", function () {
        const card = new MiningRights();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        for (let land of game.getAvailableSpacesOnLand(player)) {
            if (land.bonus.indexOf(SpaceBonus.STEEL) !== -1 || land.bonus.indexOf(SpaceBonus.TITANIUM) !== -1) {
                game.addTile(player, land.spaceType, land, { tileType: TileType.SPECIAL });
            }
        }
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MiningRights();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
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
