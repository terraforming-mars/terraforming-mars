import {expect} from 'chai';
import {Tactician} from '../../src/server/milestones/Tactician';
import {Player} from '../../src/server/Player';
import {Virus} from '../../src/server/cards/base/Virus';
import {RoboticWorkforce} from '../../src/server/cards/base/RoboticWorkforce';
import {RestrictedArea} from '../../src/server/cards/base/RestrictedArea';
import {FloaterLeasing} from '../../src/server/cards/colonies/FloaterLeasing';
import {MarketManipulation} from '../../src/server/cards/colonies/MarketManipulation';
import {ProjectInspection} from '../../src/server/cards/promo/ProjectInspection';
import {OrbitalCleanup} from '../../src/server/cards/promo/OrbitalCleanup';
import {Recruitment} from '../../src/server/cards/turmoil/Recruitment';
import {VoteOfNoConfidence} from '../../src/server/cards/turmoil/VoteOfNoConfidence';
import {LawSuit} from '../../src/server/cards/promo/LawSuit';
import {CrashSiteCleanup} from '../../src/server/cards/promo/CrashSiteCleanup';
import {MartianSurvey} from '../../src/server/cards/prelude/MartianSurvey';
import {PermafrostExtraction} from '../../src/server/cards/base/PermafrostExtraction';
import {BannedDelegate} from '../../src/server/cards/turmoil/BannedDelegate';
import {InterstellarColonyShip} from '../../src/server/cards/base/InterstellarColonyShip';
import {SpinInducingAsteroid} from '../../src/server/cards/venusNext/SpinInducingAsteroid';
import {Conscription} from '../../src/server/cards/colonies/Conscription';
import {CupolaCity} from '../../src/server/cards/base/CupolaCity';
import {VenusianAnimals} from '../../src/server/cards/venusNext/VenusianAnimals';
import {SpaceHotels} from '../../src/server/cards/prelude/SpaceHotels';
import {GMOContract} from '../../src/server/cards/turmoil/GMOContract';
import {PioneerSettlement} from '../../src/server/cards/colonies/PioneerSettlement';
import {Algae} from '../../src/server/cards/base/Algae';
import {TestPlayer} from '../TestPlayer';

describe('Tactician', function() {
  let milestone: Tactician;
  let player: Player;

  beforeEach(function() {
    milestone = new Tactician();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not claim without 5 cards with requirements', function() {
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

    expect(milestone.canClaim(player)).is.not.true;
  });

  it('Excludes event cards with requirements', function() {
    player.playedCards.push(new PermafrostExtraction());
    player.playedCards.push(new InterstellarColonyShip());
    player.playedCards.push(new SpinInducingAsteroid());
    player.playedCards.push(new MartianSurvey());
    player.playedCards.push(new Conscription());
    player.playedCards.push(new BannedDelegate());
    player.playedCards.push(new CrashSiteCleanup());

    expect(milestone.canClaim(player)).is.not.true;
  });

  it('Can claim with 5 cards with requirements', function() {
    player.playedCards.push(new CupolaCity());
    player.playedCards.push(new VenusianAnimals());
    player.playedCards.push(new SpaceHotels());
    player.playedCards.push(new PioneerSettlement());
    player.playedCards.push(new GMOContract());

    expect(milestone.canClaim(player)).is.true;
  });


  it('Can claim with >5 cards (here: 6) with requirements', function() {
    player.playedCards.push(new CupolaCity());
    player.playedCards.push(new VenusianAnimals());
    player.playedCards.push(new SpaceHotels());
    player.playedCards.push(new PioneerSettlement());
    player.playedCards.push(new GMOContract());
    player.playedCards.push(new Algae());

    expect(milestone.canClaim(player)).is.true;
  });
});
