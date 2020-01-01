import { expect } from "chai";
import { Viron } from "../../../src/cards/venusNext/Viron";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { InventorsGuild } from '../../../src/cards/InventorsGuild';
import { SelectCard } from "../../../src/inputs/SelectCard";

describe("Viron", function () {
    it("Should act", function () {
        const card = new Viron();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.corporationCard = card;
        player.cardsInHand.push(new InventorsGuild());
        player.setActionsThisGeneration(new InventorsGuild().name);
        const action2 = card.action(player, game);
        expect(action2).not.to.eq(undefined);
        expect(action2 instanceof SelectCard).to.eq(true);
    });
});