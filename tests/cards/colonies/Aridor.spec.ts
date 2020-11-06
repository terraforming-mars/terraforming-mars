import { expect } from "chai";
import { Aridor } from "../../../src/cards/colonies/Aridor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Predators } from "../../../src/cards/Predators";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { ResearchOutpost } from "../../../src/cards/ResearchOutpost";

describe("Aridor", function () {
    it("Should play", function () {
        const card = new Aridor();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);        
        const game = new Game("foobar", [player,player2], player);
        const play = card.play();
        expect(play).is.undefined;
        player.corporationCard = card;
        card.onCardPlayed(player, game, new Predators());
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        card.onCardPlayed(player2, game, new ResearchOutpost());
        expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
        card.onCardPlayed(player, game, new ResearchOutpost());
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    });
});