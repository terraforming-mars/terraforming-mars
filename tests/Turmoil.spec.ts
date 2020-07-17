import { expect } from "chai";
import { Color } from "../src/Color";
import { Player } from "../src/Player";
import { PartyName } from "../src/turmoil/parties/PartyName";
import { Game, GameOptions } from "../src/Game";
import { BoardName } from "../src/BoardName";
import { Unity } from "../src/turmoil/parties/Unity";
import { Greens } from "../src/turmoil/parties/Greens";
import { MarsFirst } from "../src/turmoil/parties/MarsFirst";
import { Phase } from "../src/Phase";
import { OrOptions } from "../src/inputs/OrOptions";
import { SelectSpace } from "../src/inputs/SelectSpace";
import { SpaceBonus } from "../src/SpaceBonus";
import { Turmoil } from "../src/turmoil/Turmoil";
import { resetBoard, maxOutOceans } from "./TestingUtils";
import { Reds } from "../src/turmoil/parties/Reds";
import { ReleaseOfInertGases } from "../src/cards/ReleaseOfInertGases";
import { JovianEmbassy } from "../src/cards/promo/JovianEmbassy";
import { IceAsteroid } from "../src/cards/IceAsteroid";
import { ProtectedValley } from "../src/cards/ProtectedValley";

describe("Turmoil", function () {
    let player : Player, game : Game, turmoil: Turmoil;

    beforeEach(function() {
        player = new Player("test", Color.BLUE, false);
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
        
          game = new Game("foobar", [player], player, gameOptions);
          turmoil = game.turmoil!;
          resetBoard(game);
    });

    it("Should initialize with right defaults", function () {
        expect(turmoil.chairman).to.eq("NEUTRAL");
    });

    it("Correctly send delegate", function () {
        const greens = turmoil.getPartyByName(PartyName.GREENS)!;
        greens.delegates = [];
        
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        expect(greens.delegates.length).to.eq(1);
        expect(game.getPlayerById(greens.delegates[0])).to.eq(player);
    });

    it("Correctly set dominant party", function () {
        const greens = turmoil.getPartyByName(PartyName.GREENS)!;
        const reds = turmoil.getPartyByName(PartyName.REDS)!;
        greens.delegates = [];
        reds.delegates = [];
        
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        expect(turmoil.dominantParty).to.eq(greens);

        turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
        expect(turmoil.dominantParty).to.eq(greens);

        turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
        expect(turmoil.dominantParty).to.eq(reds);     
    });

    it("Correctly set party leader", function () {
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        expect(game.getPlayerById(turmoil.getPartyByName(PartyName.GREENS)!.partyLeader!)).to.eq(player);   
    });

    it("Correctly run end of generation", function () {
        turmoil.sendDelegateToParty(player.id, PartyName.MARS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.MARS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.MARS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.MARS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.MARS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        turmoil.endGeneration(game);
        expect(game.getPlayerById(turmoil.chairman!)).to.eq(player);

        expect(turmoil.lobby.size).to.eq(1);
        expect(turmoil.rulingParty).to.eq(turmoil.getPartyByName(PartyName.MARS));
        expect(turmoil.dominantParty).to.eq(turmoil.getPartyByName(PartyName.GREENS));
    });

    it("Check ruling policy", function () {
        turmoil.rulingParty = new Unity();
        game.phase = Phase.ACTION;
        expect(player.getTitaniumValue(game)).to.eq(4);
        
        turmoil.rulingParty = new Greens();
        game.addGreenery(player, "10");
        expect(player.megaCredits).to.eq(4);

        turmoil.rulingParty = new MarsFirst();
        game.addGreenery(player, "11");
        expect(player.steel).to.eq(1);
    });

    it("Does not give Mars First bonus for World Government terraforming", function () {
        turmoil.rulingParty = new MarsFirst();
        game.phase = Phase.ACTION;

        player.worldGovernmentTerraforming(game);
        const action = player.getWaitingFor() as OrOptions;
        const placeOcean = action.options.find((option) => option.title === "Add an ocean") as SelectSpace;
        const steelSpace = placeOcean.availableSpaces.find((space) => space.bonus.indexOf(SpaceBonus.STEEL) !== -1);

        placeOcean.cb(steelSpace!);
        expect(player.steel).to.eq(0); // should not give ruling policy bonus
    });

    it("Can't raise TR via Standard Projects if Reds are ruling and player cannot pay", function () {
        turmoil.rulingParty = new Reds();
        player.megaCredits = 14;
        const availableStandardProjects = player.getAvailableStandardProjects(game);
        
        // can only use Power Plant as cannot pay 3 for Reds ruling policy
        expect(availableStandardProjects.options.length).to.eq(1); 
    });

    it("Can't play cards to raise TR directly if Reds are ruling and player cannot pay", function () {
        turmoil.rulingParty = new Reds();
        player.megaCredits = 16;
        const releaseOfInertGases = new ReleaseOfInertGases();
        const jovianEmbassy = new JovianEmbassy();
        
        expect(releaseOfInertGases.canPlay(player, game)).to.eq(false); // needs 20 MC
        expect(jovianEmbassy.canPlay(player, game)).to.eq(false); // needs 17 MC
    });

    it("Can't play cards to raise TR via global parameters if Reds are ruling and player cannot pay", function () {
        turmoil.rulingParty = new Reds();
        player.megaCredits = 25;
        const iceAsteroid = new IceAsteroid();
        const protectedValley = new ProtectedValley();
        
        expect(iceAsteroid.canPlay(player, game)).to.eq(false); // needs 29 MC
        expect(protectedValley.canPlay(player, game)).to.eq(false); // needs 26 MC

        // can play if won't gain TR from raising global parameter
        maxOutOceans(player, game, 9);
        expect(protectedValley.canPlay(player, game)).to.eq(true);
        expect(iceAsteroid.canPlay(player, game)).to.eq(true);
    });
});
