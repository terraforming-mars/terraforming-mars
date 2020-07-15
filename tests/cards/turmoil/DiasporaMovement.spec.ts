import { expect } from "chai";
import { DiasporaMovement } from "../../../src/cards/turmoil/DiasporaMovement";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Resources } from "../../../src/Resources";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { ColonizerTrainingCamp } from "../../../src/cards/ColonizerTrainingCamp";
import { MethaneFromTitan } from "../../../src/cards/MethaneFromTitan";
import { Turmoil } from "../../../src/turmoil/Turmoil";
import { IParty } from "../../../src/turmoil/parties/IParty";

describe("DiasporaMovement", function () {
    let card : DiasporaMovement, player : Player, player2 : Player, game : Game, turmoil: Turmoil, reds: IParty;

    beforeEach(function() {
        card = new DiasporaMovement();
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
          reds  = turmoil.getPartyByName(PartyName.REDS)!;
    });

    it("Can't play", function () {
        reds.sendDelegate(player.id, game);        
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        reds.sendDelegate(player.id, game);
        reds.sendDelegate(player.id, game);
        expect(card.canPlay(player, game)).to.eq(true);

        player.playedCards.push(new ColonizerTrainingCamp());
        player2.playedCards.push(new MethaneFromTitan());
        card.play(player, game);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
    });
});
