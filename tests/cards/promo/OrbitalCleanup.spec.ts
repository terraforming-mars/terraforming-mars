import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/cards/base/AdvancedAlloys';
import {Research} from '../../../src/cards/base/Research';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {OrbitalCleanup} from '../../../src/cards/promo/OrbitalCleanup';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('OrbitalCleanup', function() {
  let card : OrbitalCleanup; let player : Player;

  beforeEach(function() {
    card = new OrbitalCleanup();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player);
  });

  it('Can\'t play if cannot decrease MC production', function() {
    player.addProduction(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
  });

  it('Should act', function() {
    player.playedCards.push(new Research());
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new ResearchCoordination());

    card.action(player);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(4);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
