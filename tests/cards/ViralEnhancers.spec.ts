
import { expect } from "chai";
import { ViralEnhancers } from "../../src/cards/ViralEnhancers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Ants } from "../../src/cards/Ants";
import { Birds } from "../../src/cards/Birds";
import { Moss } from "../../src/cards/Moss";
import { OrOptions } from "../../src/inputs/OrOptions";


describe("ViralEnhancers", function () {
    it("Should play", function () {
        const card = new ViralEnhancers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.cardPlayedEvents.length).to.eq(1);
        expect(player.cardPlayedEvents[0](card)).to.eq(undefined);
        expect(player.plants).to.eq(1);
        const ants = new Ants();
        const birds = new Birds();
        const moss = new Moss();
        let orOptions = player.cardPlayedEvents[0](birds) as OrOptions;
        orOptions.options[0].cb();
        expect(birds.animals).to.eq(1);
        orOptions.options[1].cb();
        expect(player.plants).to.eq(2);
        orOptions = player.cardPlayedEvents[0](ants) as OrOptions;
        orOptions.options[0].cb();
        expect(ants.microbes).to.eq(1);
        orOptions.options[1].cb();
        expect(player.plants).to.eq(3);
        expect(player.cardPlayedEvents[0](moss)).to.eq(undefined);
        expect(player.plants).to.eq(4);
        
    });
});
