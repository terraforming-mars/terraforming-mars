import { expect } from "chai";
import { NitrogenFromTitan } from "../../../src/cards/colonies/NitrogenFromTitan";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { JovianLanterns } from "../../../src/cards/colonies/JovianLanterns";
import { TitanFloatingLaunchPad } from "../../../src/cards/colonies/TitanFloatingLaunchPad";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { ICard } from "../../../src/cards/ICard";

describe("NitrogenFromTitan", function () {
    let card : NitrogenFromTitan, player : Player, game : Game;

    beforeEach(function() {
        card = new NitrogenFromTitan();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can play without floaters", function () {
        const tr = player.getTerraformRating();
        card.play(player, game);
        expect(player.getTerraformRating()).to.eq(tr + 2);
        expect(game.interrupts.length).to.eq(0);
    });

    it("Can play with single Jovian floater card", function () {
        const jovianLanterns = new JovianLanterns();
        player.playedCards.push(jovianLanterns);

        card.play(player, game);
        const orOptions = game.interrupts[0].playerInput as SelectCard<ICard>;
        orOptions.cb([jovianLanterns]);
        expect(jovianLanterns.resourceCount).to.eq(2);
    });

    it("Can play with multiple Jovian floater cards", function () {
        const jovianLanterns = new JovianLanterns();
        player.playedCards.push(jovianLanterns, new TitanFloatingLaunchPad());

        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);

        const orOptions = game.interrupts[0].playerInput as SelectCard<ICard>;
        orOptions.cb([jovianLanterns]);
        expect(jovianLanterns.resourceCount).to.eq(2);
    });
});