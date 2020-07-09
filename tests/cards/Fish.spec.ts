import { expect } from "chai";
import { Fish } from "../../src/cards/Fish";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Fish", function () {
    let card : Fish, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new Fish();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should act", function () {
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });

    it("Should play - auto select if single target", function () {
        (game as any).temperature = 2;
        player2.setProduction(Resources.PLANTS);

        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player, game);

        expect(game.interrupts.length).to.eq(0);
        expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
    });

    it("Should play - multiple targets", function () {
        (game as any).temperature = 2;
        player.setProduction(Resources.PLANTS);
        player2.setProduction(Resources.PLANTS);

        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player, game);

        expect(game.interrupts.length).to.eq(1);
        const selectPlayer = game.interrupts[0].playerInput as SelectPlayer;
        selectPlayer.cb(player2);
        expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
    });

    it("Should give victory points", function () {
        player.addResourceTo(card, 5);
        expect(card.getVictoryPoints()).to.eq(card.resourceCount);
    });
});
