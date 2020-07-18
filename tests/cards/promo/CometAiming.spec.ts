import { expect } from "chai";
import { CometAiming } from "../../../src/cards/promo/CometAiming";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { RotatorImpacts } from "../../../src/cards/venusNext/RotatorImpacts";
import { maxOutOceans } from "./../../TestingUtils";

describe("CometAiming", function () {
    let card : CometAiming, player : Player, game : Game;

    beforeEach(function() {
        card = new CometAiming();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        expect(card.play()).to.eq(undefined);
    });

    it("Can't act", function () {
        player.playedCards.push(card);
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Should act - single action choice, single target", function () {
        player.playedCards.push(card);
        player.titanium = 1;
        expect(card.canAct(player, game)).to.eq(true);

        card.action(player, game);
        expect(player.titanium).to.eq(0);
        expect(card.resourceCount).to.eq(1);

        card.action(player, game);
        expect(game.interrupts.length).to.eq(1);
        let selectSpace = game.interrupts[0].playerInput as SelectSpace;
        selectSpace.cb(selectSpace.availableSpaces[0]);
        expect(player.getTerraformRating()).to.eq(21);
    });
    
    it("Should act - multiple action choices, multiple targets", function () {
        const card2 = new RotatorImpacts();
        player.playedCards.push(card, card2);

        player.titanium = 1;
        card.resourceCount = 1;

        const action = card.action(player, game) as OrOptions;
        action.options[1].cb([card2]);
        expect(card2.resourceCount).to.eq(1);
        expect(player.titanium).to.eq(0);
    });

    it("Cannot spend resource to place ocean if oceans are maxed", function () {
        player.playedCards.push(card);
        card.resourceCount = 1;
        maxOutOceans(player, game);
        expect(card.canAct(player, game)).to.eq(false);

        player.titanium = 1;
        expect(card.canAct(player, game)).to.eq(true);

        card.action(player, game);
        expect(game.interrupts.length).to.eq(0);
        expect(player.titanium).to.eq(0);
        expect(card.resourceCount).to.eq(2);
    });
});
