import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {Virus} from '../../../src/cards/base/Virus';
import {InterplanetaryCinematics} from '../../../src/cards/corporation/InterplanetaryCinematics';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('InterplanetaryCinematics', function() {
  let card: InterplanetaryCinematics;
  let player: TestPlayer;

  beforeEach(function() {
    card = new InterplanetaryCinematics();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.steel).to.eq(20);
  });

  it('Has onCardPlayed', function() {
    player.setCorporationForTest(card);
    card.onCardPlayed(player, new Bushes());
    expect(player.megaCredits).to.eq(0);
    card.onCardPlayed(player, new Virus());
    expect(player.megaCredits).to.eq(2);
  });
});
