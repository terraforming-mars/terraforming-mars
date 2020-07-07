import { expect } from "chai";
import { EnergyMarket } from "../../../src/cards/promo/EnergyMarket";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { SelectAmount } from "../../../src/inputs/SelectAmount";
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("EnergyMarket", function () {
    let card : EnergyMarket, player : Player, game : Game;

    beforeEach(function() {
        card = new EnergyMarket();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Can't act", function () {
        player.setResource(Resources.MEGACREDITS, 1);
        expect(card.canAct(player)).to.eq(false);
    });

    it("Can act when sufficient MC resources available", function () {
        player.setResource(Resources.MEGACREDITS, 2);
        expect(card.canAct(player)).to.eq(true);
    });

    it("Can act when sufficient MC (using heat) resources available", function () {
        player.canUseHeatAsMegaCredits = true;
        player.setResource(Resources.MEGACREDITS, 1);
        player.setResource(Resources.HEAT, 3);
        expect(card.canAct(player)).to.eq(true);
    });

    it("Can act when energy production available", function () {
        player.setProduction(Resources.ENERGY, 1);
        expect(card.canAct(player)).to.eq(true);
    });

    it("Should act and provide options when enough MC resources and energy production available", function () {
        player.setResource(Resources.MEGACREDITS, 2);
        player.setProduction(Resources.ENERGY, 1);
        expect(card.canAct(player)).to.eq(true);

        const result = card.action(player, game);
        expect(result instanceof OrOptions).to.eq(true);
    });

    it("Should act when sufficient MC resources available", function () {
        player.setResource(Resources.MEGACREDITS, 2);
        const result = card.action(player, game);
        expect(result instanceof SelectAmount).to.eq(true);
    });

    it("Should act when energy production available", function () {
        player.setProduction(Resources.ENERGY, 1);
        const result = card.action(player, game);
        expect(result).to.eq(undefined);
        
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(8);
    });
});