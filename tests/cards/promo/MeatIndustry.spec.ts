import { expect } from "chai";
import { MeatIndustry } from "../../../src/cards/promo/MeatIndustry";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Fish } from "../../../src/cards/Fish";
import { Predators } from "../../../src/cards/Predators";
import { Game } from "../../../src/Game";
import { EosChasmaNationalPark } from "../../../src/cards/EOSChasmaNationalPark";

describe("MeatIndustry", function () {
    it("Gives 2 MC whenever player gains an animal", function () {
        const card = new MeatIndustry();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        player.playedCards.push(card);

        // Get 2 MC when player gains animals
        const fish = new Fish();
        player.playedCards.push(fish);
        fish.action(player);
        expect(player.megaCredits).to.eq(2);

        const eosChasmaNationalPark = new EosChasmaNationalPark();
        eosChasmaNationalPark.play(player, game);
        expect(fish.resourceCount).to.eq(2);
        expect(player.megaCredits).to.eq(4);

        // Don't get MC when other players gain animals
        const predators = new Predators();
        player2.playedCards.push(predators);
        predators.action(player2, game);
        expect(player.megaCredits).to.eq(4);
    });
});
