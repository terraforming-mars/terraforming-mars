import { expect } from "chai";
import { PharmacyUnion } from "../../../src/cards/promo/PharmacyUnion";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Tags } from "../../../src/cards/Tags";
import { Ants } from "../../../src/cards/Ants";
import { ViralEnhancers } from "../../../src/cards/ViralEnhancers";
import { SearchForLife } from "../../../src/cards/SearchForLife";
import { LagrangeObservatory } from "../../../src/cards/LagrangeObservatory";
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("PharmacyUnion", function () {
    it("Should play", function () {
        const card = new PharmacyUnion();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        
        card.initialAction(player, game);
        card.play();

        expect(card.resourceCount).to.eq(2);
        expect(player.cardsInHand.length).to.eq(1);
        expect(player.cardsInHand[0].tags.includes(Tags.SCIENCE)).to.eq(true);
    });

    it("Gains diseases when ANY player plays microbe cards", function () {
        const card = new PharmacyUnion();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        card.play();
        player.corporationCard = card;

        const ants = new Ants();
        player.playedCards.push(ants);
        card.onCardPlayed(player, game, ants);
        expect(card.resourceCount).to.eq(3);

        const viralEnhancers = new ViralEnhancers();
        player2.playedCards.push(viralEnhancers);
        card.onCardPlayed(player2, game, viralEnhancers);
        expect(card.resourceCount).to.eq(4);
    });
    
    it("Removes diseases and gives TR only when corp owner plays science cards", function () {
        const card = new PharmacyUnion();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        card.play();
        player.corporationCard = card;

        const searchForLife = new SearchForLife();
        player.playedCards.push(searchForLife);
        card.onCardPlayed(player, game, searchForLife);
        expect(card.resourceCount).to.eq(1);
        expect(player.getTerraformRating()).to.eq(21);

        const lagrangeObservatory = new LagrangeObservatory();
        player2.playedCards.push(lagrangeObservatory);
        card.onCardPlayed(player2, game, lagrangeObservatory);
        expect(card.resourceCount).to.eq(1);
        expect(player.getTerraformRating()).to.eq(21);
    });

    it("Can turn card face down once per game to gain 3 TR if no diseases on card", function () {
        const card = new PharmacyUnion();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.corporationCard = card;
        card.resourceCount = 0;

        const searchForLife = new SearchForLife();
        player.playedCards.push(searchForLife);
        card.onCardPlayed(player, game, searchForLife);
        expect(game.interrupts.length).to.eq(1);
        
        const orOptions: OrOptions = game.interrupts[0].playerInput as OrOptions;
        game.interrupts.splice(0, 1);
        orOptions.options[0].cb();

        expect(player.getTerraformRating()).to.eq(23);
        expect(card.tags.length).to.eq(0);
        
        // Cannot trigger once per game effect a second time
        card.onCardPlayed(player, game, searchForLife);
        expect(game.interrupts.length).to.eq(0);
        expect(player.getTerraformRating()).to.eq(23);
    });
});