
import { expect } from "chai";
import { Comet } from "../../src/cards/Comet";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";
import { TileType } from "../../src/TileType";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { maxOutOceans } from "../TestingUtils"

describe("Comet", function () {
    it("Should play", function () {
        const card = new Comet();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("victim", Color.GREEN, false);
        const player3 = new Player("notarget", Color.YELLOW, false);
        player2.plants = 3;
        player3.plants = 2;

        const game = new Game("foobar", [player, player2, player3], player);

        const action = card.play(player, game);
        expect(action instanceof AndOptions).to.eq(true);
        if ( ! (action instanceof AndOptions)) return;

        expect(action.options.length).to.eq(2);

        expect(action instanceof AndOptions).to.eq(true);
        action.options[0].cb((action.options[0] as SelectSpace).availableSpaces[0]);
        action.options[1].cb(player2);

        // Victim loses his plants
        expect(player2.plants).to.eq(0);

        // Ocean goes to selected space
        const space = (action.options[0] as SelectSpace).availableSpaces[0];
        expect(space.tile !== undefined && space.tile.tileType).to.eq(TileType.OCEAN);

        action.cb();
        expect(game.getTemperature()).to.eq(-28);
    });

    it("Does not provide an option to remove plants", function () {
        // I mean, no plants -> no option to remove them
        const card = new Comet();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("no_plants_game", [player,player2], player);
        const action = card.play(player, game);
        
        expect(action instanceof AndOptions).to.eq(true);
        if ( ! (action instanceof AndOptions)) return;

        expect(action.options.length).to.eq(1);
        expect(action.options[0].title).to.eq('Select space for ocean tile')
    });

    it("Provides no options if there is nothing to confirm", function () {
        const card = new Comet();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("no_options_game", [player,player2], player);
        
        maxOutOceans(player, game);
        player.plants = 8;

        const action = card.play(player, game);

        expect(action).to.eq(undefined);
        expect(player.plants).to.eq(8); // self plants are not removed
        expect(game.getTemperature()).to.eq(-28);
    });

    it("Works fine in solo mode", function() {
        const card = new Comet();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("solo_game", [player], player);

        player.plants = 8;

        var action = card.play(player, game);
        
        expect(action instanceof SelectSpace).to.eq(true);
        if ( ! (action instanceof SelectSpace)) return;

        expect(action.title).to.eq('Select space for ocean tile');
        
        // Ocean goes to selected space
        const space = action.availableSpaces[0];

        expect(space).not.to.eq(undefined);
        if (space === undefined) return;

        action.cb(space);
        expect(game.board.getOceansOnBoard()).to.eq(1);
        expect(game.getTemperature()).to.eq(-28);

        // No oceans to place case
        maxOutOceans(player, game);

        action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.getTemperature()).to.eq(-26); 
    });
});
