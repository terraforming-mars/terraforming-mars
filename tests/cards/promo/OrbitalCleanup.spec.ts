import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/server/cards/base/AdvancedAlloys';
import {Research} from '../../../src/server/cards/base/Research';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {OrbitalCleanup} from '../../../src/server/cards/promo/OrbitalCleanup';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('OrbitalCleanup', function() {
  let card: OrbitalCleanup;
  let player: Player;

  beforeEach(function() {
    card = new OrbitalCleanup();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Can not play if cannot decrease MC production', function() {
    player.production.add(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.megacredits).to.eq(-2);
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
