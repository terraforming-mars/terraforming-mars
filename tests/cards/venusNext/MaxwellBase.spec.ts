import { expect } from "chai";
import { MaxwellBase } from "../../../src/cards/venusNext/MaxwellBase";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game, GameOptions } from '../../../src/Game';
import { Resources } from "../../../src/Resources";
import { AerialMappers } from '../../../src/cards/venusNext/AerialMappers';
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Birds } from '../../../src/cards/Birds';
import { StratosphericBirds } from "../../../src/cards/venusNext/StratosphericBirds";
import { ICard } from "../../../src/cards/ICard";
import { BoardName } from "../../../src/BoardName";

describe("MaxwellBase", function () {
    let card : MaxwellBase, player : Player, game : Game;

    beforeEach(function() {
        card = new MaxwellBase();
        player = new Player("test", Color.BLUE, false);

        const gameOptions = {
            draftVariant: false,
            initialDraftVariant: false,
            corporateEra: true,
            randomMA: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            turmoilExtension: false,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: [],
            solarPhaseOption: false,
            promoCardsOption: false,
            undoOption: false,
            startingCorporations: 2,
            includeVenusMA: true,
            soloTR: false,
            clonedGamedId: undefined
          } as GameOptions;
        game = new Game("foobar", [player,player], player, gameOptions);
    });

    it("Can't play without energy production", function () {
        (game as any).venusScaleLevel = 12;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if Venus requirement not met", function () {
        player.setProduction(Resources.ENERGY);
        (game as any).venusScaleLevel = 10;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        (game as any).venusScaleLevel = 12;
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player,game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    });

    it("Should act - single target", function () {
        const card2 = new Birds();
        const card3 = new AerialMappers();

        player.playedCards.push(card, card2);
        expect(card.canAct(player)).to.eq(false);

        player.playedCards.push(card3);
        expect(card.canAct(player)).to.eq(true);        
        card.action(player, game);
        expect(player.getResourcesOnCard(card3)).to.eq(1);
    });

    it("Should act - multiple targets", function () {
        const card2 = new StratosphericBirds();
        const card3 = new AerialMappers()
        player.playedCards.push(card, card2, card3);
        expect(card.canAct(player)).to.eq(true);

        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        (action as SelectCard<ICard>).cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
    });
});