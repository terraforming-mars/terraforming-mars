import { expect } from "chai";
import { Election } from "../../src/turmoil/globalEvents/Election";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { StripMine } from '../../src/cards/StripMine';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';

describe("Election", function () {
    it("resolve play", function () {
        const card = new Election();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.GREEN, false);
        const game = new Game("foobar", [player,player2, player3], player);
        const turmoil = new Turmoil(game);
        turmoil.initGlobalEvent(game);
        player.playedCards.push(new StripMine());
        player2.playedCards.push(new StripMine());
        player2.playedCards.push(new StripMine());
        game.addCityTile(player3, game.board.getAvailableSpacesOnLand(player3)[0].id);
        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        card.resolve(game, turmoil);
        expect(player.getTerraformRating()).to.eq(21);
        expect(player2.getTerraformRating()).to.eq(22);
        expect(player3.getTerraformRating()).to.eq(21);

    });
});