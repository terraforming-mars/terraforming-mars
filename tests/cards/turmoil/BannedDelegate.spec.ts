import { expect } from "chai";
import { BannedDelegate } from "../../../src/cards/turmoil/BannedDelegate";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { GameOptions, Game } from "../../../src/Game";
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { Turmoil } from "../../../src/turmoil/Turmoil";
import { SelectDelegate } from "../../../src/inputs/SelectDelegate";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { setCustomGameOptions } from "../../TestingUtils";

describe("Banned Delegate", function () {
    let card : BannedDelegate, player : Player, player2 : Player, game : Game, turmoil: Turmoil;

    beforeEach(function() {
        card = new BannedDelegate();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);

        const gameOptions = setCustomGameOptions() as GameOptions;
        game = new Game("foobar", [player, player2], player, gameOptions);
        turmoil = game.turmoil!;
    });

    it("Can't play", function () {
        turmoil.chairman = player2.id;
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        turmoil.chairman = player.id;
        expect(card.canPlay(player, game)).is.true;

        const greens = turmoil.getPartyByName(PartyName.GREENS)!;
        turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
        turmoil.sendDelegateToParty(player2.id, PartyName.GREENS, game);
        const initialDelegatesCount = greens.delegates.length;

        const result = card.play(player, game);

        if (result instanceof SelectDelegate) {
            const selectDelegate = result as SelectDelegate;
            selectDelegate.cb(result.players[0]);
        } else {
            const orOptions = result as OrOptions;
            orOptions.options.forEach((option) => option.cb((option as SelectDelegate).players[0]));
        }

        expect(greens.delegates).has.lengthOf(initialDelegatesCount - 1);
    });
});
