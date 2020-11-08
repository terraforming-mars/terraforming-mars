import { expect } from "chai";
import { MaxwellBase } from "../../../src/cards/venusNext/MaxwellBase";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game, GameOptions } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { AerialMappers } from "../../../src/cards/venusNext/AerialMappers";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { Birds } from "../../../src/cards/Birds";
import { StratosphericBirds } from "../../../src/cards/venusNext/StratosphericBirds";
import { ICard } from "../../../src/cards/ICard";
import { setCustomGameOptions } from "../../TestingUtils";

describe("MaxwellBase", function () {
    let card : MaxwellBase, player : Player, game : Game;

    beforeEach(function() {
        card = new MaxwellBase();
        player = new Player("test", Color.BLUE, false);

        const gameOptions = setCustomGameOptions() as GameOptions;
        game = new Game("foobar", [player,player], player, gameOptions);
    });

    it("Can't play without energy production", function () {
        (game as any).venusScaleLevel = 12;
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Can't play if Venus requirement not met", function () {
        player.addProduction(Resources.ENERGY);
        (game as any).venusScaleLevel = 10;
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        player.addProduction(Resources.ENERGY);
        (game as any).venusScaleLevel = 12;
        expect(card.canPlay(player, game)).is.true;

        const action = card.play(player,game);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    });

    it("Should act - single target", function () {
        const card2 = new Birds();
        const card3 = new AerialMappers();

        player.playedCards.push(card, card2);
        expect(card.canAct(player)).is.not.true;

        player.playedCards.push(card3);
        expect(card.canAct(player)).is.true;        
        card.action(player, game);
        expect(player.getResourcesOnCard(card3)).to.eq(1);
    });

    it("Should act - multiple targets", function () {
        const card2 = new StratosphericBirds();
        const card3 = new AerialMappers()
        player.playedCards.push(card, card2, card3);
        expect(card.canAct(player)).is.true;

        const action = card.action(player, game);
        expect(action instanceof SelectCard).is.true;
        (action as SelectCard<ICard>).cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
    });
});