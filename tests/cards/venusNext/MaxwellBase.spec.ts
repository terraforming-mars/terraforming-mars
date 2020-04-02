
import { expect } from "chai";
import { MaxwellBase } from "../../../src/cards/venusNext/MaxwellBase";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game, GameOptions } from '../../../src/Game';
import { Resources } from "../../../src/Resources";
import { AerialMappers } from '../../../src/cards/venusNext/AerialMappers';
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Birds } from '../../../src/cards/Birds';
import { BoardName } from '../../../src/BoardName';

describe("MaxwellBase", function () {
    it("Should play", function () {
        const card = new MaxwellBase();
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = {
            draftVariant: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: false,
            corporations: []
          } as GameOptions;
        const game = new Game("foobar", [player,player], player, gameOptions);
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).to.eq(false);
        const action = card.play(player,game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    });
    it("Should act", function () {
        const card = new MaxwellBase();
        const card2 = new Birds();
        const card3 = new AerialMappers()
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        player.playedCards.push(card2);
        expect(card.canAct(player)).to.eq(false);
        player.playedCards.push(card3);
        expect(card.canAct(player)).to.eq(true);        
        const action = card.action(player);
        expect(action instanceof SelectCard).to.eq(true);
        action.cb([card3]);
        expect(player.getResourcesOnCard(card3)).to.eq(1);
    });
});