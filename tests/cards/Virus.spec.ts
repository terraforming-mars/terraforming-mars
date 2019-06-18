
import { expect } from "chai";
import { Virus } from "../../src/cards/Virus";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";
import { Birds } from "../../src/cards/Birds";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("Virus", function () {
    it("Should play", function () {
        const card = new Virus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.plants = 5;
        const selectPlayer = card.play(player, game) as SelectPlayer;
        expect(selectPlayer).not.to.eq(undefined);
        selectPlayer.cb(selectPlayer.players[0]);
        expect(player.plants).to.eq(0);
        const birds = new Birds();
        player.playedCards.push(birds);
        player.addResourceTo(birds);
        const orOptions = card.play(player, game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        player.plants = 5;
        orOptions.options[0].cb([player.playedCards[0]]);
        expect(player.plants).to.eq(5);
        expect(player.getResourcesOnCard(birds)).to.eq(0);
        orOptions.options[1].cb(player);
        expect(player.plants).to.eq(0);
    });
});
