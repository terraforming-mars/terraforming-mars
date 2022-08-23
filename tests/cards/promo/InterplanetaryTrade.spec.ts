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
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('InterplanetaryTrade', function() {
  let card: InterplanetaryTrade;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new InterplanetaryTrade();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
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
    game.gameOptions.venusNextExtension = true;
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
    game.gameOptions.venusNextExtension = true;
    game.gameOptions.moonExpansion = true;
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
    game.gameOptions.venusNextExtension = true;
    game.gameOptions.moonExpansion = true;
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
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should raise MC production by one', function() {
    card.play(player);
    expect(player.production.megacredits).to.eq(1);
  });
});
