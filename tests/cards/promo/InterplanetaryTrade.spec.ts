import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/cards/base/AdvancedAlloys';
import {AdvancedEcosystems} from '../../../src/cards/base/AdvancedEcosystems';
import {ColonizerTrainingCamp} from '../../../src/cards/base/ColonizerTrainingCamp';
import {LunarBeam} from '../../../src/cards/base/LunarBeam';
import {MarsUniversity} from '../../../src/cards/base/MarsUniversity';
import {SpaceElevator} from '../../../src/cards/base/SpaceElevator';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {InterplanetaryTrade} from '../../../src/cards/promo/InterplanetaryTrade';
import {MaxwellBase} from '../../../src/cards/venusNext/MaxwellBase';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('InterplanetaryTrade', function() {
  let card : InterplanetaryTrade; let player : Player;

  beforeEach(function() {
    card = new InterplanetaryTrade();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foo', [player], player);
  });

  it('Should play', function() {
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new SpaceElevator());
    player.playedCards.push(new MarsUniversity());
    player.playedCards.push(new ResearchCoordination());

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });

  it('Should only count wildcards up to the max amount of tag types existing', function() {
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new SpaceElevator());
    player.playedCards.push(new MarsUniversity());
    player.playedCards.push(new ResearchCoordination());
    player.playedCards.push(new AdvancedEcosystems());
    player.playedCards.push(new MaxwellBase());
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new ColonizerTrainingCamp());

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(12);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should raise MC production by one', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
