import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/server/cards/base/AdvancedAlloys';
import {AdvancedEcosystems} from '../../../src/server/cards/base/AdvancedEcosystems';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {CupolaCity} from '../../../src/server/cards/base/CupolaCity';
import {LunarBeam} from '../../../src/server/cards/base/LunarBeam';
import {MarsUniversity} from '../../../src/server/cards/base/MarsUniversity';
import {SpaceElevator} from '../../../src/server/cards/base/SpaceElevator';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {InterplanetaryTrade} from '../../../src/server/cards/promo/InterplanetaryTrade';
import {MaxwellBase} from '../../../src/server/cards/venusNext/MaxwellBase';
import {DeclarationOfIndependence} from '../../../src/server/cards/pathfinders/DeclarationOfIndependence';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {GameOptions} from '../../../src/server/game/GameOptions';
import {testGame} from '../../TestingUtils';

describe('InterplanetaryTrade', function() {
  let card: InterplanetaryTrade;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new InterplanetaryTrade();
    [game, player] = testGame(1);
  });

  it('Should play', function() {
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new SpaceElevator());
    player.playedCards.push(new MarsUniversity());
    player.playedCards.push(new ResearchCoordination());

    card.play(player);
    expect(player.production.megacredits).to.eq(4);
  });

  it('Should only count wild tags up to the max amount of tag types existing (10 at base)', function() {
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new SpaceElevator());
    player.playedCards.push(new MarsUniversity());
    player.playedCards.push(new ResearchCoordination());
    player.playedCards.push(new AdvancedEcosystems());
    player.playedCards.push(new CupolaCity());
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new ColonizerTrainingCamp());
    card.play(player);
    expect(player.production.megacredits).to.eq(10);
  });

  it('Should only count wild tags up to the max amount of tag types existing (11 with venus)', function() {
    (game.gameOptions as GameOptions).venusNextExtension = true;
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new SpaceElevator());
    player.playedCards.push(new MarsUniversity());
    player.playedCards.push(new ResearchCoordination());
    player.playedCards.push(new AdvancedEcosystems());
    player.playedCards.push(new MaxwellBase());
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new ColonizerTrainingCamp());
    card.play(player);
    expect(player.production.megacredits).to.eq(11);
  });

  it('Should only count wild tags up to the max amount of tag types existing (12 with venus and moon)', function() {
    (game.gameOptions as GameOptions).venusNextExtension = true;
    (game.gameOptions as GameOptions).moonExpansion = true;
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new SpaceElevator());
    player.playedCards.push(new MarsUniversity());
    player.playedCards.push(new ResearchCoordination());
    player.playedCards.push(new AdvancedEcosystems());
    player.playedCards.push(new MaxwellBase());
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new ColonizerTrainingCamp());
    card.play(player);
    expect(player.production.megacredits).to.eq(12);
  });

  it('Should only count wild tags up to the max amount of tag types existing (13 with venus, moon, and Mars)', function() {
    (game.gameOptions as GameOptions).venusNextExtension = true;
    (game.gameOptions as GameOptions).moonExpansion = true;
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new SpaceElevator());
    player.playedCards.push(new MarsUniversity());
    player.playedCards.push(new ResearchCoordination());
    player.playedCards.push(new AdvancedEcosystems());
    player.playedCards.push(new MaxwellBase());
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new ColonizerTrainingCamp());
    player.playedCards.push(new DeclarationOfIndependence());
    card.play(player);
    expect(player.production.megacredits).to.eq(12);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Should raise MC production by one', function() {
    card.play(player);
    expect(player.production.megacredits).to.eq(1);
  });
});
