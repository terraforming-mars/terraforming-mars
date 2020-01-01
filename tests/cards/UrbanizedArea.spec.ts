
import { expect } from "chai";
import { UrbanizedArea } from "../../src/cards/UrbanizedArea";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SpaceName } from "../../src/SpaceName";
import { SpaceType } from "../../src/SpaceType";
import { Resources } from '../../src/Resources';

describe("UrbanizedArea", function () {
    it("Can't play", function () {
        const card = new UrbanizedArea();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new UrbanizedArea();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const tharsis = game.getSpace(SpaceName.THARSIS_THOLUS);
        const lands = game.getAdjacentSpaces(tharsis).filter((space) => space.spaceType === SpaceType.LAND);
        game.addCityTile(player, lands[0].id);
        game.addCityTile(player, lands[1].id);
        player.setProduction(Resources.ENERGY);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action.availableSpaces.length).to.eq(1);
        action.cb(action.availableSpaces[0]);
        expect(game.getCitiesInPlay()).to.eq(3);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});
