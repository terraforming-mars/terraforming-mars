import { expect } from "chai";
import { ProjectInspection } from "../../../src/cards/promo/ProjectInspection";
import { RestrictedArea } from "../../../src/cards/RestrictedArea"
import { SelectCard } from "../../../src/inputs/SelectCard"
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";

describe("ProjectInspection", function () {
    it("Can't play if no actions played this turn", function () {
        const card = new ProjectInspection();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Can't play if available actions can't act", function () {
        const card = new ProjectInspection();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        const actionCard = new RestrictedArea();
        player.playedCards.push(actionCard);
        player.setActionsThisGeneration(actionCard.name);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new ProjectInspection();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        const actionCard = new RestrictedArea();
        player.setResource(Resources.MEGACREDITS, 2);
        player.playedCards.push(actionCard);
        player.setActionsThisGeneration(actionCard.name);
        expect(card.canPlay(player, game)).to.eq(true);
        const play = card.play(player, game);
        expect(play).not.to.eq(undefined);
        expect(play instanceof SelectCard).to.eq(true);
    });
});