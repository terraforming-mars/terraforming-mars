import { expect } from "chai";
import { Incite } from "../../../src/cards/community/Incite";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game, GameOptions } from '../../../src/Game';
import { setCustomGameOptions } from "../../TestingUtils";
import { SelectParty } from "../../../src/interrupts/SelectParty";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("Incite", function () {
    let card : Incite, player : Player, game : Game;

    beforeEach(function() {
        card = new Incite();
        player = new Player("test", Color.BLUE, false);

        const gameOptions = setCustomGameOptions() as GameOptions;
        game = new Game("foobar", [player], player, gameOptions);

        card.play(player, game);
        player.corporationCard = card;
    });

    it("Starts with +1 influence", function () {
        expect(game.turmoil!.getPlayerInfluence(player)).to.eq(1);
    });

    it("Can perform initial action", function () {
        card.initialAction(player, game);
        expect(game.interrupts.length).to.eq(1);

        game.interrupts[0].generatePlayerInput?.();
        const selectParty = game.interrupts[0] as SelectParty;
        (selectParty.playerInput as OrOptions).options[0].cb();

        const marsFirst = game.turmoil!.getPartyByName(PartyName.MARS);
        expect(marsFirst!.delegates.filter((d) => d === player.id).length).to.eq(2);
    });
});
