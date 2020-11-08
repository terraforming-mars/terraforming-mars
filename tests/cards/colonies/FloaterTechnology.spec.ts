import { expect } from "chai";
import { FloaterTechnology } from "../../../src/cards/colonies/FloaterTechnology";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { ICard } from "../../../src/cards/ICard";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { FloatingHabs } from "../../../src/cards/venusNext/FloatingHabs";

describe("FloaterTechnology", function () {
    let card : FloaterTechnology, player : Player, game : Game;

    beforeEach(function() {
        card = new FloaterTechnology();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can play", function () {
        const result = card.play();
        expect(result).is.undefined;
    });

    it("Cannot act without targets", function () {
        expect(card.canAct(player)).is.not.true;
    });
    
    it("Acts automatically with single targets", function () {
        const dirigibles = new Dirigibles();
        player.playedCards.push(dirigibles);

        card.action(player, game);
        expect(game.deferredActions).has.lengthOf(1);
        const input = game.deferredActions.next()!.execute();
        expect(input).is.undefined;
        expect(dirigibles.resourceCount).to.eq(1);
    });

    it("Should act with multiple targets", function () {
        const dirigibles = new Dirigibles();
        const floatingHabs = new FloatingHabs();
        player.playedCards.push(dirigibles, floatingHabs);

        card.action(player, game);
        expect(game.deferredActions).has.lengthOf(1);

        const selectCard = game.deferredActions.next()!.execute() as SelectCard<ICard>;
        selectCard.cb([floatingHabs]);
        expect(floatingHabs.resourceCount).to.eq(1);
        expect(dirigibles.resourceCount).to.eq(0);
    });
});
