import {ICard} from '../../../src/cards/ICard';

import { expect } from "chai";
import { AerialMappers } from "../../../src/cards/venusNext/AerialMappers";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";
import { SelectCard } from '../../../src/inputs/SelectCard';

describe("AerialMappers", function () {
    it("Should play", function () {
        const card = new AerialMappers();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new AerialMappers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(card);
        const action = card.action(player,game) as SelectCard<ICard>;
        expect(action instanceof SelectCard).to.eq(true);
        action.cb([card]);
        expect(player.getResourcesOnCard(card)).to.eq(1);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb();
        expect(player.getResourcesOnCard(card)).to.eq(0);
        expect(player.cardsInHand.length).to.eq(1);
    });
});