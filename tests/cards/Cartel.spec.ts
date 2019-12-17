
import { expect } from "chai";
import { Cartel } from "../../src/cards/Cartel";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { ImportedHydrogen } from "../../src/cards/ImportedHydrogen";
import { InterstellarColonyShip } from "../../src/cards/InterstellarColonyShip";
import { LunarBeam } from "../../src/cards/LunarBeam";

describe("Cartel", function () {
    it("Should play", function () { 
        const card = new Cartel();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(1);
        player.playedCards.push(card);
        card.play(player);
        expect(player.megaCreditProduction).to.eq(3);
    });

    it("Correctly counts tags", function () {
        const card = new Cartel();
        const cards = [
            new ImportedHydrogen(), // event with earth tag
            new InterstellarColonyShip(), // event with earth tag
            new LunarBeam() // Another card with earch tag
        ]
        const player = new Player("test", Color.BLUE, false);

        player.playedCards = player.playedCards.concat(cards);
        
        card.play(player);

        expect(player.megaCreditProduction).to.eq(2); // Only for LunarBeam and Cartel itself
    });
});
