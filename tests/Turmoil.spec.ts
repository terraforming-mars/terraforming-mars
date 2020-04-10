
import { expect } from "chai";
import { Color } from "../src/Color";
import { Player } from "../src/Player";
import { Turmoil } from "../src/turmoil/Turmoil";
import { PartyName } from "../src/turmoil/parties/PartyName";

describe("Turmoil", function () {
    it("should initialize with right defaults", function () {
        const turmoil = new Turmoil();
        expect(turmoil.chairman).to.eq(undefined);
    });

    it("correctly add delegate and set dominant party", function () {
        const player = new Player("test", Color.BLUE, false);
        const turmoil = new Turmoil();
        turmoil.sendDelegateToParty(player, PartyName.GREENS);
        const greens = turmoil.getPartyByName(PartyName.GREENS);
        if (greens) {
            expect(greens.delegates.length).to.eq(1);
            expect(greens.delegates[0].name).to.eq(player.name);
            expect(turmoil.dominantParty).to.eq(greens);
        }
    });
});
