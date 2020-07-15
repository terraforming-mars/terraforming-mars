
import { expect } from "chai";
import { DawnCity } from "../../../src/cards/venusNext/DawnCity";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game, GameOptions } from '../../../src/Game';
import { Resources } from "../../../src/Resources";
import { BoardName } from '../../../src/BoardName';

describe("DawnCity", function () {
    it("Should play", function () {
        const card = new DawnCity();
        const player = new Player("test", Color.BLUE, false,);
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
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player)).to.eq(false);
        const action = card.play(player,game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    });
});