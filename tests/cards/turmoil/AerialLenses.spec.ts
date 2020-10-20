import { expect } from "chai";
import { AerialLenses } from "../../../src/cards/turmoil/AerialLenses";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Resources } from "../../../src/Resources";
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { setCustomGameOptions } from "../../TestingUtils";

describe("AerialLenses", function () {
    let card : AerialLenses, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new AerialLenses();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);

        const gameOptions = setCustomGameOptions() as GameOptions;
        game = new Game("foobar", [player, player2], player, gameOptions);  
    });

    it("Can play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
        
        const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS)!;    
        kelvinists.delegates.push(player.id, player.id);
        expect(card.canPlay(player, game)).to.eq(true);
    });

    it("Should play without plants", function () {
        card.play(player, game);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
        const input = game.deferredActions[0].execute();
        expect(input).to.eq(undefined);
    });

    it("Should play with plants", function () {
        player2.plants = 5;
        card.play(player, game);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
        expect(game.deferredActions.length).to.eq(1);

        const orOptions = game.deferredActions[0].execute() as OrOptions;
        orOptions.options[0].cb();
        expect(player2.plants).to.eq(3);
    });
});
