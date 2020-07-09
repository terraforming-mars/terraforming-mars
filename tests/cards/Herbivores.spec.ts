import { expect } from "chai";
import { Herbivores } from "../../src/cards/Herbivores";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Herbivores", function () {
    let card : Herbivores, player : Player, player2: Player, game: Game;

    beforeEach(function() {
        card = new Herbivores();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play if nobody has plant production", function () {
        (game as any).oxygenLevel = 8;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if oxygen level too low", function () {
        (game as any).oxygenLevel = 7;
        player2.setProduction(Resources.PLANTS);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play - auto select if single target", function () {
        (game as any).oxygenLevel = 8;
        player2.setProduction(Resources.PLANTS);
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        expect(card.resourceCount).to.eq(1);

        expect(game.interrupts.length).to.eq(0);
        expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
    });

    it("Should play - multiple targets", function () {
        player.setProduction(Resources.PLANTS);
        player2.setProduction(Resources.PLANTS);

        card.play(player, game);
        expect(card.resourceCount).to.eq(1);

        expect(game.interrupts.length).to.eq(1);
        const selectPlayer = game.interrupts[0].playerInput as SelectPlayer;
        selectPlayer.cb(player2);
        expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
    });

    it("Should add resources", function () {
        player.playedCards.push(card);
        expect(card.resourceCount).to.eq(0);

        game.addGreenery(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        game.addGreenery(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(card.resourceCount).to.eq(2);

        game.addGreenery(player2, game.board.getAvailableSpacesOnLand(player2)[0].id);
        expect(card.resourceCount).to.eq(2); // i.e. not changed

        expect(card.getVictoryPoints()).to.eq(1);
    });

    it("Should be playable in solo mode", function () {
        const game = new Game("foobar_solo", [player], player);
        (game as any).oxygenLevel = 8;
        expect(card.canPlay(player, game)).to.eq(true);
    });
});
