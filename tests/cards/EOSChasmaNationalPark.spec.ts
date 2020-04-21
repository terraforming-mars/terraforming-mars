
import { expect } from "chai";
import { EosChasmaNationalPark } from "../../src/cards/EOSChasmaNationalPark";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { Birds } from "../../src/cards/Birds";
import { Fish } from "../../src/cards/Fish";
import { Resources } from '../../src/Resources';

describe("EosChasmaNationalPark", function () {
    it("Can't play", function () {
        const card = new EosChasmaNationalPark();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {

        const card = new EosChasmaNationalPark();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);

        // Fit minimal requirements
        (game as any).temperature = -12;

        // Add cards to choose from
        const birds = new Birds();
        const fish = new Fish();
        player.playedCards.push(birds);
        player.playedCards.push(fish);

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player);
        expect(action instanceof SelectCard).to.eq(true);
        if (action === undefined) return;
        player.playedCards.push(card);

        action.cb([birds]);

        player.getVictoryPoints(game);

        expect(player.getResourcesOnCard(birds)).to.eq(1);
        expect(player.plants).to.eq(3);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });

  
});

