import { expect } from "chai";
import { MoholeLake } from "../../../src/cards/promo/MoholeLake";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { Fish } from "../../../src/cards/Fish";
import { Ants } from "../../../src/cards/Ants";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { ICard } from "../../../src/cards/ICard";

describe("MoholeLake", function () {
    it("Can play", function () {
        const card = new MoholeLake();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        card.play(player, game);

        expect(game.interrupts.length).to.eq(1);
        let selectSpace = game.interrupts[0].playerInput as SelectSpace;
        selectSpace.cb(selectSpace.availableSpaces[0]);
        
        expect(game.getTemperature()).to.eq(-28);
        expect(game.board.getOceansOnBoard()).to.eq(1);
        expect(player.getTerraformRating()).to.eq(22);
        expect(player.plants).to.eq(3);
    });

    it("Can't act", function () {
        const card = new MoholeLake();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        card.play(player, game);

        expect(card.canAct(player)).to.eq(false);
    });

    it("Can act - single target", function () {
        const card = new MoholeLake();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        const fish = new Fish();
        player.playedCards.push(fish);

        card.play(player, game);
        expect(card.canAct(player)).to.eq(true);
        card.action(player);
        expect(fish.resourceCount).to.eq(1);
    });

    it("Can act - multiple targets", function () {
        const card = new MoholeLake();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        const fish = new Fish();
        const ants = new Ants();
        player.playedCards.push(fish, ants);

        card.play(player, game);
        expect(card.canAct(player)).to.eq(true);
        const action = card.action(player) as SelectCard<ICard>;
        
        action.cb([ants]);
        expect(ants.resourceCount).to.eq(1);
    });
});
