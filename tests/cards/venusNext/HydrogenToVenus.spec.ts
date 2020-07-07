import {ICard} from '../../../src/cards/ICard';
import { expect } from "chai";
import { HydrogenToVenus } from "../../../src/cards/venusNext/HydrogenToVenus";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { ColonizerTrainingCamp } from '../../../src/cards/ColonizerTrainingCamp';
import { DeuteriumExport } from '../../../src/cards/venusNext/DeuteriumExport';
import { Dirigibles } from '../../../src/cards/venusNext/Dirigibles';

describe("HydrogenToVenus", function () {
    let card : HydrogenToVenus, player : Player, game : Game;

    beforeEach(function() {
        card = new HydrogenToVenus();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play with multiple venus cards", function () {
        const card2 = new DeuteriumExport();
        const card3 = new ColonizerTrainingCamp();
        const card4 = new Dirigibles();
        player.playedCards.push(card2, card3, card4);

        const action = card.play(player, game)  as SelectCard<ICard>;
        expect(action instanceof SelectCard).to.eq(true);
        action.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });

    it("Should play with single venus card", function () {
        const card = new HydrogenToVenus();
        const card2 = new DeuteriumExport();
        const card3 = new ColonizerTrainingCamp();
        player.playedCards.push(card2, card3);

        card.play(player, game)  as SelectCard<ICard>;
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });

    it("Should play with no venus cards", function () {
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});
