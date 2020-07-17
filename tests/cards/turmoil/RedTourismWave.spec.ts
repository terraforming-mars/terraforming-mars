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
        const game = new Game("foobar", [player,player], player, gameOptions);  
        expect(card.canPlay(player, game)).to.eq(false);
        
        let reds = game.turmoil!.getPartyByName(PartyName.REDS)!;
        reds.delegates.push(player.id, player.id);
        expect(card.canPlay(player, game)).to.eq(true);

        const tharsis = game.getSpace(SpaceName.THARSIS_THOLUS);
        const lands = game.board.getAdjacentSpaces(tharsis).filter((space) => space.spaceType === SpaceType.LAND);
        game.addCityTile(player, lands[0].id);
        card.play(player, game);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(3); 
    });
});
