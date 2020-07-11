import { expect } from "chai";
import { CloudSeeding } from "../../src/cards/CloudSeeding";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { maxOutOceans } from "../TestingUtils"
import { Resources } from '../../src/Resources';
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("CloudSeeding", function () {
    let card : CloudSeeding, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new CloudSeeding();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play if cannot reduce MC production", function () { 
        maxOutOceans(player, game, 3);
        player.setProduction(Resources.MEGACREDITS, -5);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if ocean requirements not met", function () { 
        maxOutOceans(player, game, 2);
        player.setProduction(Resources.HEAT);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if no one has heat production", function () {
        maxOutOceans(player, game, 3);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play - auto select if single target", function () {
        // Meet requirements
        player2.setProduction(Resources.HEAT);
        maxOutOceans(player, game, 3);
        expect(card.canPlay(player, game)).to.eq(true);
        
        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);

        expect(game.interrupts.length).to.eq(0);
        expect(player2.getProduction(Resources.HEAT)).to.eq(0);
    });

    it("Should play - multiple targets", function () {
        player.setProduction(Resources.HEAT);
        player2.setProduction(Resources.HEAT);
        
        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);

        expect(game.interrupts.length).to.eq(1);
        const selectPlayer = game.interrupts[0].playerInput as SelectPlayer;
        selectPlayer.cb(player2);
        expect(player2.getProduction(Resources.HEAT)).to.eq(0);
    });
});
