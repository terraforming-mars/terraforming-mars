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
import { CrashSiteCleanup } from "../../src/cards/promo/CrashSiteCleanup";
import { MartianSurvey } from "../../src/cards/prelude/MartianSurvey";
import { PermafrostExtraction } from "../../src/cards/PermafrostExtraction";
import { BannedDelegate } from "../../src/cards/turmoil/BannedDelegate";
import { InterstellarColonyShip } from "../../src/cards/InterstellarColonyShip";
import { SpinInducingAsteroid } from "../../src/cards/venusNext/SpinInducingAsteroid";
import { Conscription } from "../../src/cards/colonies/Conscription";
import { CupolaCity } from "../../src/cards/CupolaCity";
import { VenusianAnimals } from "../../src/cards/venusNext/VenusianAnimals";
import { SpaceHotels } from "../../src/cards/prelude/SpaceHotels";
import { GMOContract } from "../../src/cards/turmoil/GMOContract";
import { PioneerSettlement } from "../../src/cards/colonies/PioneerSettlement";

describe("Tactician", function () {
  let milestone : Tactician, player : Player, player2 : Player, game : Game;

  beforeEach(function() {
    milestone = new Tactician();
      player = new Player("test", Color.BLUE, false);
      player2 = new Player("test2", Color.RED, false);
      game = new Game("foobar", [player, player2], player);
  });

  it("Can't claim without 5 cards with requirements", function () {
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

    it("Excludes event cards with requirements", function () {
      player.playedCards.push(new PermafrostExtraction());
      player.playedCards.push(new InterstellarColonyShip());
      player.playedCards.push(new SpinInducingAsteroid());
      player.playedCards.push(new MartianSurvey());
      player.playedCards.push(new Conscription());
      player.playedCards.push(new BannedDelegate());
      player.playedCards.push(new CrashSiteCleanup());

      expect(milestone.canClaim(player, game)).to.eq(false);
    });

    it("Can claim", function () {
      player.playedCards.push(new CupolaCity());
      player.playedCards.push(new VenusianAnimals());
      player.playedCards.push(new SpaceHotels());
      player.playedCards.push(new PioneerSettlement());
      player.playedCards.push(new GMOContract());

      expect(milestone.canClaim(player, game)).to.eq(true);
    });
});
