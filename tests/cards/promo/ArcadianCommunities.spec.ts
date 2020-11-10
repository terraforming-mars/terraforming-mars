import { expect } from "chai";
import { ArcadianCommunities } from "../../../src/cards/promo/ArcadianCommunities";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SelectSpace } from "../../../src/inputs/SelectSpace";


describe("ArcadianCommunities", function () {
    it("Should play", function () {
        const card = new ArcadianCommunities();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const play = card.play(player);
        expect(play).is.undefined;
        expect(player.steel).to.eq(10);
        player.corporationCard = card;

        const initLands = game.board.getAvailableSpacesForGreenery(player);
        initLands[1].player = player;
        const action = card.action(player, game);
        expect(action instanceof SelectSpace).is.true;
        if ( ! (action instanceof SelectSpace)) return;
        
        const lands = game.board.getAvailableSpacesForMarker(player);
        action.cb(lands[0]);

        game.addCityTile(player, lands[0].id);
        expect(player.megaCredits).to.eq(3);

    });
});