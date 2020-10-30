import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { ByElection } from "../../../src/cards/community/ByElection";
import { setCustomGameOptions } from "../../TestingUtils";
import { Game, GameOptions } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("ByElection", function () {
    let card : ByElection, player : Player, game : Game;

    beforeEach(function() {
        card = new ByElection();
        player = new Player("test", Color.BLUE, false);
        
        const gameOptions = setCustomGameOptions() as GameOptions;
        game = new Game("foobar", [player, player], player, gameOptions);
    });

    it("Should play", function () {
        card.play(player, game);
        expect(game.deferredActions).has.lengthOf(1);

        const orOptions = game.deferredActions.next()!.execute() as OrOptions;
        const subOptions = orOptions.options[0] as OrOptions;
        subOptions.cb();

        const turmoil = game.turmoil!;
        expect(turmoil.playersInfluenceBonus.get(player.id)).to.eq(1);
        expect(turmoil.rulingParty!.name).to.eq(PartyName.MARS);
    });
});
