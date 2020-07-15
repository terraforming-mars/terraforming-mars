import { expect } from "chai";
import { Stratopolis } from "../../../src/cards/venusNext/Stratopolis";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game, GameOptions } from '../../../src/Game';
import { Resources } from "../../../src/Resources";
import { AerialMappers } from '../../../src/cards/venusNext/AerialMappers';
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Research } from "../../../src/cards/Research";
import { BoardName } from "../../../src/BoardName";

describe("Stratopolis", function () {
    let card : Stratopolis, player : Player, game : Game;

    beforeEach(function() {
        card = new Stratopolis();
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

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new Research());
        expect(card.canPlay(player)).to.eq(true);

        card.play(player,game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });

    it("Should act - single target", function () {
        player.playedCards.push(card);
        card.action(player, game);
        expect(player.getResourcesOnCard(card)).to.eq(2);
    });

    it("Should act - multiple targets", function () {
        const card2 = new AerialMappers();
        player.playedCards.push(card, card2);

        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        action!.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(2);
    });
});