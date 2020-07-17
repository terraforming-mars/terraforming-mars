import { expect } from "chai";
import { PowerPlant } from "../../../src/cards/PowerPlant";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { MagneticShield } from "../../../src/cards/promo/MagneticShield";
import { Game } from "../../../src/Game";

describe("MagneticShield", function () {
    let card : MagneticShield, player : Player, game : Game;

    beforeEach(function() {
        card = new MagneticShield();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play if not enough power tags available", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new PowerPlant());
        player.playedCards.push(new PowerPlant());
        expect(card.canPlay(player, game)).to.eq(true);
        
        card.play(player, game);
        expect(player.getTerraformRating()).to.eq(24);
    });
});
