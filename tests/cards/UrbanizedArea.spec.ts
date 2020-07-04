import { expect } from "chai";
import { UrbanizedArea } from "../../src/cards/UrbanizedArea";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SpaceName } from "../../src/SpaceName";
import { SpaceType } from "../../src/SpaceType";
import { Resources } from '../../src/Resources';
import { ISpace } from "../../src/ISpace";

describe("UrbanizedArea", function () {
    let card : UrbanizedArea, player : Player, game : Game, lands: ISpace[];

    beforeEach(function() {
        card = new UrbanizedArea();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);

        const tharsisTholus = game.getSpace(SpaceName.THARSIS_THOLUS);
        lands = game.board.getAdjacentSpaces(tharsisTholus).filter((space) => space.spaceType === SpaceType.LAND);
    });

    it("Can't play without energy production", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play without available space between two cities", function () {
        game.addCityTile(player, lands[0].id);
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        game.addCityTile(player, lands[0].id);
        game.addCityTile(player, lands[1].id);

        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action.availableSpaces.length).to.eq(1);

        action.cb(action.availableSpaces[0]);
        expect(game.getCitiesInPlay()).to.eq(3);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});
