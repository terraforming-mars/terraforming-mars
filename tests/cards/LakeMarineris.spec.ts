import { expect } from "chai";
import { LakeMarineris } from "../../src/cards/LakeMarineris";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("LakeMarineris", function () {
    let card : LakeMarineris, player : Player, game : Game;

    beforeEach(function() {
        card = new LakeMarineris();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        (game as any).temperature = -0;
        expect(card.canPlay(player, game)).is.true;
        card.play(player, game);

        expect(game.deferredActions).has.lengthOf(2);
        const firstOcean = game.deferredActions.shift()!.execute() as SelectSpace;
        firstOcean.cb(firstOcean.availableSpaces[0]);
        const secondOcean = game.deferredActions.shift()!.execute() as SelectSpace;
        secondOcean.cb(secondOcean.availableSpaces[1]);
        expect(player.getTerraformRating()).to.eq(22);
        
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});
