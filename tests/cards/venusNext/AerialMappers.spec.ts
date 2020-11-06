import { ICard } from "../../../src/cards/ICard";
import { expect } from "chai";
import { AerialMappers } from "../../../src/cards/venusNext/AerialMappers";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";

describe("AerialMappers", function () {
    let card : AerialMappers, player : Player, game : Game;

    beforeEach(function() {
        card = new AerialMappers();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
        player.playedCards.push(card);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).is.undefined;
    });

    it("Should act - multiple targets", function () {
        const card2 = new Dirigibles();
        player.playedCards.push(card2);
        const action = card.action(player,game) as SelectCard<ICard>;
        expect(action instanceof SelectCard).is.true;

        action.cb([card]);
        expect(card.resourceCount).to.eq(1);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions instanceof OrOptions).is.true;
        
        orOptions.options[0].cb([card]);
        expect(card.resourceCount).to.eq(0);
        expect(player.cardsInHand).has.lengthOf(1);
    });

    it("Should act - single target", function () {
        card.action(player,game)
        expect(card.resourceCount).to.eq(1);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions instanceof OrOptions).is.true;
        orOptions.options[0].cb([card]);
        expect(card.resourceCount).to.eq(0);
        expect(player.cardsInHand).has.lengthOf(1);
    });
});