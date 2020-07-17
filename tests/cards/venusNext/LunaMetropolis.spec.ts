import { expect } from "chai";
import { LunaMetropolis } from "../../../src/cards/venusNext/LunaMetropolis";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game, GameOptions } from '../../../src/Game';
import { Resources } from "../../../src/Resources";
import { BoardName } from '../../../src/BoardName';

describe("LunaMetropolis", function () {
    it("Should play", function () {
        const card = new LunaMetropolis();
        const player = new Player("test", Color.BLUE, false);
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
        const game = new Game("foobar", [player,player], player, gameOptions);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});