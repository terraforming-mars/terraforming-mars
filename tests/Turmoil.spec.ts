
import { expect } from "chai";
import { Color } from "../src/Color";
import { Player } from "../src/Player";
import { PartyName } from "../src/turmoil/parties/PartyName";
import { Game, GameOptions } from "../src/Game";
import { BoardName } from "../src/BoardName";

describe("Turmoil", function () {
    it("Should initialize with right defaults", function () {
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = {
            draftVariant: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            turmoilExtension: true,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: [],
            solarPhaseOption: false
          } as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        const turmoil = game.turmoil;
        if (turmoil) {
            expect(turmoil.chairman).to.eq("NEUTRAL");
        }
    });

    it("Correctly send delegate", function () {
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = {
            draftVariant: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            turmoilExtension: true,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: [],
            solarPhaseOption: false
          } as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        let turmoil = game.turmoil;
        if (turmoil) {
            const greens = turmoil.getPartyByName(PartyName.GREENS);
            if (greens) {
                greens.delegates = [];
                turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
                expect(greens.delegates.length).to.eq(1);
                expect(greens.delegates[0]).to.eq(player);
            }
        }
    });

    it("Correctly set dominant party", function () {
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = {
            draftVariant: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            turmoilExtension: true,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: [],
            solarPhaseOption: false
          } as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        let turmoil = game.turmoil;
        if (turmoil) {
            turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
            turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
            turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
            const greens = turmoil.getPartyByName(PartyName.GREENS);
            expect(turmoil.dominantParty).to.eq(greens);
            turmoil.sendDelegateToParty(player, PartyName.REDS, game);
            expect(turmoil.dominantParty).to.eq(greens);
            turmoil.sendDelegateToParty(player, PartyName.REDS, game);
            turmoil.sendDelegateToParty(player, PartyName.REDS, game);
            turmoil.sendDelegateToParty(player, PartyName.REDS, game);
            turmoil.sendDelegateToParty(player, PartyName.REDS, game);
            const reds = turmoil.getPartyByName(PartyName.REDS);
            expect(turmoil.dominantParty).to.eq(reds);     
        }   
    });

    it("Correctly set party leader", function () {
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = {
            draftVariant: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            turmoilExtension: true,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: [],
            solarPhaseOption: false
          } as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        let turmoil = game.turmoil;
        if (turmoil) {
            turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
            turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
            turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
            expect(turmoil.getPartyByName(PartyName.GREENS)!.partyLeader).to.eq(player);   
        } 
    });

    it("Correctly run end of generation", function () {
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = {
            draftVariant: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            turmoilExtension: true,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: [],
            solarPhaseOption: false
          } as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        let turmoil = game.turmoil;
        if (turmoil) {
            turmoil.sendDelegateToParty(player, PartyName.MARS, game);
            turmoil.sendDelegateToParty(player, PartyName.MARS, game);
            turmoil.sendDelegateToParty(player, PartyName.MARS, game);
            turmoil.sendDelegateToParty(player, PartyName.MARS, game);
            turmoil.sendDelegateToParty(player, PartyName.MARS, game);
            turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
            turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
            turmoil.endGeneration(game);
            expect(turmoil.chairman).to.eq(player);
            expect(turmoil.lobby.size).to.eq(1);
            expect(turmoil.rulingParty).to.eq(turmoil.getPartyByName(PartyName.MARS));
            expect(turmoil.dominantParty).to.eq(turmoil.getPartyByName(PartyName.GREENS));
        }
    });
});
