import { expect } from "chai";
import { ProjectInspection } from "../../../src/cards/promo/ProjectInspection";
import { RestrictedArea } from "../../../src/cards/RestrictedArea"
import { SelectCard } from "../../../src/inputs/SelectCard"
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";

describe("ProjectInspection", function () {
    let card : ProjectInspection, player : Player, game : Game, actionCard: RestrictedArea;

    beforeEach(function() {
        card = new ProjectInspection();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
        actionCard = new RestrictedArea();
        player.playedCards.push(actionCard);
    });

    it("Can't play if no actions played this turn", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if available actions can't act", function () {
        player.setActionsThisGeneration(actionCard.name);
        player.megaCredits = 1;

        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setResource(Resources.MEGACREDITS, 2);
        player.setActionsThisGeneration(actionCard.name);
        expect(card.canPlay(player, game)).to.eq(true);

        const play = card.play(player, game);
        expect(play instanceof SelectCard).to.eq(true);
    });
});