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
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = -0;
        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player, game);

        expect(game.interrupts.length).to.eq(2);
        const firstOcean = game.interrupts[0].playerInput as SelectSpace;
        firstOcean.cb(firstOcean.availableSpaces[0]);
        const secondOcean = game.interrupts[1].playerInput as SelectSpace;
        secondOcean.cb(secondOcean.availableSpaces[1]);
        expect(player.getTerraformRating()).to.eq(22);
        
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});
