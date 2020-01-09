import { expect } from "chai";
import { JetStreamMicroscrappers } from "../../../src/cards/venusNext/JetStreamMicroscrappers";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";
import { SelectOption } from '../../../src/inputs/SelectOption';

describe("JetStreamMicroscrappers", function () {
    it("Should play", function () {
        const card = new JetStreamMicroscrappers();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new JetStreamMicroscrappers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(card);
        player.titanium = 2;
        const action = card.action(player,game) as SelectOption;
        expect(action instanceof SelectOption).to.eq(true);
        action.cb();
        expect(player.getResourcesOnCard(card)).to.eq(2);
        expect(player.titanium).to.eq(1);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb();
        expect(player.getResourcesOnCard(card)).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});