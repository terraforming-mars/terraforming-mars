import { expect } from "chai";
import { CulturalMetropolis } from "../../../src/cards/turmoil/CulturalMetropolis";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Game, GameOptions } from '../../../src/Game';
import { Resources } from "../../../src/Resources";
import { BoardName } from "../../../src/BoardName";

describe("Cultural Metropolis", function () {
    it("Should play", function () {
        const card = new CulturalMetropolis();
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
            solarPhaseOption: false,
            promoCardsOption: false,
            startingCorporations: 2
          } as GameOptions;
        const game = new Game("foobar", [player,player], player, gameOptions);  
        player.setProduction(Resources.ENERGY);
        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    });
});
