import { expect } from "chai";
import { Flooding } from "../../src/cards/Flooding";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { SpaceType } from "../../src/SpaceType";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("Flooding", function () {
    let card : Flooding, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new Flooding();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play", function () {
        const oceans = game.board.getAvailableSpacesForOcean(player);
        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);

        expect(action!.cb(oceans[0])).to.eq(undefined);
        const adjacentSpaces = game.board.getAdjacentSpaces(oceans[0]);
        oceans[0].tile = undefined;
        for (let i = 0; i < adjacentSpaces.length; i++) {
            if (adjacentSpaces[i].spaceType === SpaceType.LAND) {
                game.addGreenery(player2, adjacentSpaces[i].id);
                break;
            }
        }

        const subAction: OrOptions = action!.cb(oceans[0]) as OrOptions;
        expect(subAction instanceof OrOptions).to.eq(true);
        expect(subAction!.options.length).to.eq(2);
        expect(subAction!.options[1].cb()).to.eq(undefined);
        const subActionSelectPlayer: SelectPlayer = subAction!.options[0] as SelectPlayer;
        expect(subActionSelectPlayer.players.length).to.eq(1);
        expect(subActionSelectPlayer.players[0]).to.eq(player2);

        player2.megaCredits = 4;
        subActionSelectPlayer.cb(player2);
        expect(player2.megaCredits).to.eq(0);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
    });

    it("Does not suggest to remove money from yourself", function() {
        const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
        const action = card.play(player, game);

        game.addGreenery(player, "03");
        game.addGreenery(player2, "05");

        expect(action instanceof SelectSpace).to.eq(true);
        const subActions: OrOptions = action!.cb(oceanSpaces[0]) as OrOptions;
        expect(subActions.options.length).to.eq(2);

        const subActionSelectPlayer: SelectPlayer = subActions.options[0] as SelectPlayer;
        expect(subActionSelectPlayer.players.length).to.eq(1);
        expect(subActionSelectPlayer.players[0]).to.eq(player2);
    });
});
