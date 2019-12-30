
import { expect } from "chai";
import { DeuteriumExport } from "../../../src/cards/venusNext/DeuteriumExport";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("DeuteriumExport", function () {
    it("Should play", function () {
        const card = new DeuteriumExport();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new DeuteriumExport();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player,player], player);
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.getResourcesOnCard(card)).to.eq(1);
        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(player.getResourcesOnCard(card)).to.eq(2);
        orOptions.options[1].cb();
        expect(player.getResourcesOnCard(card)).to.eq(0);
        expect(player.energyProduction).to.eq(1);
    });
});