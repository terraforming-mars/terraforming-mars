
import { expect } from "chai";
import { RoboticWorkforce } from "../../src/cards/RoboticWorkforce";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { BiomassCombustors } from "../../src/cards/BiomassCombustors";
import { NoctisFarming } from "../../src/cards/NoctisFarming";
import { FuelFactory } from "../../src/cards/FuelFactory";
import { FoodFactory } from "../../src/cards/FoodFactory";
import { Resources } from '../../src/Resources';
import { UtopiaInvest } from "../../src/cards/turmoil/UtopiaInvest";

describe("RoboticWorkforce", function () {
    it("Should throw", function () {
        const card = new RoboticWorkforce();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.play(player, game)).to.eq(undefined);
        player.playedCards.push(new FoodFactory(), new BiomassCombustors(), card);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(function () { action!.cb([card]); }).to.throw("Production not found for selected card");
        expect(function () { action!.cb([new FuelFactory()]); }).to.throw("not enough energy production");
        expect(function () { action!.cb([new FoodFactory()]); }).to.throw("not enough plant production");
    });
    it("Should play", function () {
        const card = new RoboticWorkforce();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(new NoctisFarming());
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action!.cb([new NoctisFarming()]);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
    it("Should play with corporation cards", function () {
        const card = new RoboticWorkforce();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
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
