import { expect } from "chai";
import { PowerPlant } from "../../../src/cards/PowerPlant";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { MagneticShield } from "../../../src/cards/promo/MagneticShield";
import { Game } from "../../../src/Game";

describe("MagneticShield", function () {
    it("Can't play if not enough power tags available", function () {
        const card = new MagneticShield();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MagneticShield();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);

        player.playedCards.push(new PowerPlant());
        player.playedCards.push(new PowerPlant());
        expect(card.canPlay(player)).to.eq(true);
        
        card.play(player, game);
        expect(player.getTerraformRating()).to.eq(24);
    });
});
