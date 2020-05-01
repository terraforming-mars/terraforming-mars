import { expect } from "chai";
import { RedTourismWave } from "../../../src/cards/turmoil/RedTourismWave";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { Resources } from "../../../src/Resources";
import { SpaceName } from "../../../src/SpaceName";
import { SpaceType } from "../../../src/SpaceType";

describe("RedTourismWave", function () {
    it("Should play", function () {
        const card = new RedTourismWave();
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
        expect(card.canPlay(player, game)).to.eq(false);
        if (game.turmoil !== undefined) {
            let reds = game.turmoil.getPartyByName(PartyName.REDS);
            if (reds !== undefined) {
                reds.delegates.push(player, player);
                expect(card.canPlay(player, game)).to.eq(true); 
            }
        } 
        const tharsis = game.getSpace(SpaceName.THARSIS_THOLUS);
        const lands = game.board.getAdjacentSpaces(tharsis).filter((space) => space.spaceType === SpaceType.LAND);
        game.addCityTile(player, lands[0].id);
        card.play(player, game);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(2);
    });
});
