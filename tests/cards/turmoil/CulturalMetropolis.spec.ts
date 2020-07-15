import { expect } from "chai";
import { CulturalMetropolis } from "../../../src/cards/turmoil/CulturalMetropolis";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Game, GameOptions } from '../../../src/Game';
import { Resources } from "../../../src/Resources";
import { BoardName } from "../../../src/BoardName";
import { Turmoil } from "../../../src/turmoil/Turmoil";
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { PLAYER_DELEGATES_COUNT } from "../../../src/constants";

describe("Cultural Metropolis", function () {
    let card : CulturalMetropolis, player : Player, player2 : Player, game : Game, turmoil: Turmoil;;

    beforeEach(function() {
        card = new CulturalMetropolis();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        
        const gameOptions = {
            draftVariant: false,
            initialDraftVariant: false,
            corporateEra: true,
            randomMA: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            turmoilExtension: true,
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
        
          game = new Game("foobar", [player, player2], player, gameOptions);
          turmoil = game.turmoil!;
    });

    it("Can't play without energy production", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play without 2 delegates available", function () {
        const reds = turmoil.getPartyByName(PartyName.REDS)!;

        for (let i = 0; i < PLAYER_DELEGATES_COUNT - 1; i++) {
            reds.sendDelegate(player.id, game);
        }
        
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        const unity = turmoil.getPartyByName(PartyName.UNITY)!;
        unity.sendDelegate(player.id, game);
        unity.sendDelegate(player.id, game);
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    });
});
