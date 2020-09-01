import { expect } from "chai";
import { MarketManipulation } from "../../../src/cards/colonies/MarketManipulation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Luna } from "../../../src/colonies/Luna";
import { Triton } from "../../../src/colonies/Triton";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Miranda } from "../../../src/colonies/Miranda";
import { Enceladus } from "../../../src/colonies/Enceladus";
import { Pets } from "../../../src/cards/Pets";

describe("MarketManipulation", function () {
    let card : MarketManipulation, player : Player, player2: Player, game : Game, luna: Luna;

    beforeEach(function() {
        card = new MarketManipulation();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
        luna = new Luna();
    });

    it("Should play", function () {
        let triton = new Triton();
        game.colonies.push(luna, triton);

        const action = card.play(player, game) as OrOptions;
        expect(action).not.to.eq(undefined);
        expect(action.options[0].title).to.eq("Increase Luna (MegaCredits) and decrease Triton (Titanium)")
        action.options[0].cb();

        expect(luna.trackPosition).to.eq(2);
        expect(triton.trackPosition).to.eq(0);
    });

    it("Can't play", function () {
        let enceladus = new Enceladus();
        let miranda = new Miranda();
        
        game.colonies.push(enceladus, miranda, luna);
        game.coloniesExtension = true;
        expect(card.canPlay(player, game)).to.eq(false);

        player.playCard(game, new Pets());
        expect(card.canPlay(player, game)).to.eq(true);
    });
});