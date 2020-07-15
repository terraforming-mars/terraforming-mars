import { expect } from "chai";
import { RoboticWorkforce } from "../../src/cards/RoboticWorkforce";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { BiomassCombustors } from "../../src/cards/BiomassCombustors";
import { NoctisFarming } from "../../src/cards/NoctisFarming";
import { FoodFactory } from "../../src/cards/FoodFactory";
import { Resources } from "../../src/Resources";
import { UtopiaInvest } from "../../src/cards/turmoil/UtopiaInvest";

describe("RoboticWorkforce", function () {
    let card : RoboticWorkforce, player : Player, game : Game;

    beforeEach(function() {
        card = new RoboticWorkforce();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play if no building cards to copy", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should throw", function () {
        player.playedCards.push(new FoodFactory(), new BiomassCombustors(), card);
        expect(card.canPlay(player,game)).to.eq(false);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });

    it("Should play", function () {
        player.playedCards.push(new NoctisFarming());
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action!.cb([new NoctisFarming()]);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });

    it("Should play with corporation cards", function () {
        const corporationCard = new UtopiaInvest();
        player.corporationCard = corporationCard;

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);

        expect(player.getProduction(Resources.STEEL)).to.eq(0);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(0);
        action!.cb([corporationCard as any]);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    });
});
