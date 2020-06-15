
import { expect } from "chai";
import { Tactician } from "../../src/milestones/Tactician";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Virus } from "../../src/cards/Virus";
import { RoboticWorkforce } from "../../src/cards/RoboticWorkforce";
import { RestrictedArea } from "../../src/cards/RestrictedArea";
import { FloaterLeasing } from "../../src/cards/colonies/FloaterLeasing";
import { MarketManipulation } from "../../src/cards/colonies/MarketManipulation";
import { ProjectInspection } from "../../src/cards/promo/ProjectInspection";
import { OrbitalCleanup } from "../../src/cards/promo/OrbitalCleanup";
import { Recruitment } from "../../src/cards/turmoil/Recruitment";
import { VoteOfNoConfidence } from "../../src/cards/turmoil/VoteOfNoConfidence";
import { LawSuit } from "../../src/cards/promo/LawSuit";
import { Game } from "../../src/Game";

describe("Tactician", function () {
    it("Can't claim", function () {
        const milestone = new Tactician();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        expect(milestone.canClaim(player, game)).to.eq(false);
        for (let i = 0; i < 5; i++) {
          player.playedCards.push(new Virus());
          player.playedCards.push(new RoboticWorkforce());
          player.playedCards.push(new RestrictedArea());
          player.playedCards.push(new FloaterLeasing());
          player.playedCards.push(new MarketManipulation());
          player.playedCards.push(new ProjectInspection());
          player.playedCards.push(new OrbitalCleanup());
          player.playedCards.push(new Recruitment());
          player.playedCards.push(new VoteOfNoConfidence());
          player.playedCards.push(new LawSuit());
        }
        expect(milestone.canClaim(player, game)).to.eq(false);
    });
});
