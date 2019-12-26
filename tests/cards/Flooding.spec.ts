
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
    it("Should play", function () {
        const card = new Flooding();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const oceans = game.getAvailableSpacesForOcean(player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        expect(action.cb(oceans[0])).to.eq(undefined);
        const adjacentSpaces = game.getAdjacentSpaces(oceans[0]);
        oceans[0].tile = undefined;
        for (let i = 0; i < adjacentSpaces.length; i++) {
            if (adjacentSpaces[i].spaceType === SpaceType.LAND) {
                game.addGreenery(player, adjacentSpaces[i].id);
                break;
            }
        }
        const subAction: OrOptions = action.cb(oceans[0]) as OrOptions;
        expect(subAction).not.to.eq(undefined);
        expect(subAction instanceof OrOptions).to.eq(true);
        expect(subAction.options.length).to.eq(2);
        expect(subAction.options[1].cb()).to.eq(undefined);
        const subActionSelectPlayer: SelectPlayer = subAction.options[0] as SelectPlayer;
        expect(subActionSelectPlayer.players.length).to.eq(1);
        expect(subActionSelectPlayer.players[0]).to.eq(player);
        player.megaCredits = 4;
        subActionSelectPlayer.cb(player);
        expect(player.megaCredits).to.eq(0);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(-1);
    });
});
