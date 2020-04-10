
import { expect } from "chai";
import { Color } from "../src/Color";
import { Player } from "../src/Player";
import { Turmoil } from "../src/turmoil/Turmoil";
import { PartyName } from "../src/turmoil/parties/PartyName";

describe("Turmoil", function () {
    it("Should initialize with right defaults", function () {
        const turmoil = new Turmoil();
        expect(turmoil.chairman).to.eq(undefined);
    });

    it("Correctly send delegate", function () {
        const player = new Player("test", Color.BLUE, false);
        const turmoil = new Turmoil();
        turmoil.sendDelegateToParty(player, PartyName.GREENS);
        const greens = turmoil.getPartyByName(PartyName.GREENS);
        if (greens) {
            expect(greens.delegates.length).to.eq(1);
            expect(greens.delegates[0].name).to.eq(player.name);
        }
    });

    it("Correctly set dominant party", function () {
        const player = new Player("test", Color.BLUE, false);
        const turmoil = new Turmoil();
        turmoil.sendDelegateToParty(player, PartyName.GREENS);
        const greens = turmoil.getPartyByName(PartyName.GREENS);
        expect(turmoil.dominantParty).to.eq(greens);
        turmoil.sendDelegateToParty(player, PartyName.REDS);
        expect(turmoil.dominantParty).to.eq(greens);
        const reds = turmoil.getPartyByName(PartyName.REDS);
        turmoil.sendDelegateToParty(player, PartyName.REDS);
        expect(turmoil.dominantParty).to.eq(reds);        
    });

    it("Correctly set party leader", function () {
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const turmoil = new Turmoil();
        turmoil.sendDelegateToParty(player, PartyName.GREENS);
        expect(turmoil.getPartyByName(PartyName.GREENS)!.partyLeader).to.eq(player);
        turmoil.sendDelegateToParty(player2, PartyName.GREENS);
        expect(turmoil.getPartyByName(PartyName.GREENS)!.partyLeader).to.eq(player);
        turmoil.sendDelegateToParty(player2, PartyName.GREENS);
        expect(turmoil.getPartyByName(PartyName.GREENS)!.partyLeader).to.eq(player2);        
    });
});
