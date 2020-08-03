import { expect } from "chai";
import { MartianZoo } from "../../../src/cards/colonies/MartianZoo";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { LunaGovernor } from '../../../src/cards/colonies/LunaGovernor';

describe("MartianZoo", function () {
    let card : MartianZoo, player : Player, game : Game;

    beforeEach(function() {
        card = new MartianZoo();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const lands = game.board.getAvailableSpacesOnLand(player);
        game.addCityTile(player, lands[0].id);
        game.addCityTile(player, lands[1].id);
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Can't act", function () {
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(false);
    });

    it("Should act", function () {
        card.onCardPlayed(player, game, new LunaGovernor());
        expect(card.canAct()).to.eq(true);

        card.action(player, game);
        expect(player.megaCredits).to.eq(2);
        expect(card.resourceCount).to.eq(2);
    });
});