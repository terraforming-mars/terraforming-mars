import { expect } from "chai";
import { WaterImportFromEuropa } from "../../src/cards/WaterImportFromEuropa";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { maxOutOceans } from "../TestingUtils";

describe("WaterImportFromEuropa", function () {
    let card : WaterImportFromEuropa, player : Player, game : Game;

    beforeEach(function() {
        card = new WaterImportFromEuropa();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't act", function () {
        expect(card.canAct(player,game)).is.not.true;
    });

    it("Should play", function () {
        card.play();
        player.playedCards.push(card);
        expect(card.getVictoryPoints(player)).to.eq(1);
    });

    it("Should act", function () {
        player.megaCredits = 13;

        const action = card.action(player, game);
        expect(action).is.undefined;

        game.deferredActions.runNext(); // HowToPay
        expect(player.megaCredits).to.eq(1);

        expect(game.deferredActions).has.lengthOf(1);
        const selectOcean = game.deferredActions.next()!.execute() as SelectSpace;
        selectOcean.cb(selectOcean.availableSpaces[0]);
        expect(player.getTerraformRating()).to.eq(21);
    });

    it("Can act if can pay even after oceans are maxed", function () {
        maxOutOceans(player, game);
        player.megaCredits = 12;
        
        expect(card.canAct(player, game)).is.true;
    });
});
