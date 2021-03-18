import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {Virus} from '../../../src/cards/base/Virus';
import {InterplanetaryCinematics} from '../../../src/cards/corporation/InterplanetaryCinematics';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('InterplanetaryCinematics', function() {
  let card : InterplanetaryCinematics; let player : Player;

  beforeEach(function() {
    card = new InterplanetaryCinematics();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.steel).to.eq(20);
  });

  it('Has onCardPlayed', function() {
    player.corporationCard = card;
    card.onCardPlayed(player, new Bushes());
    expect(player.megaCredits).to.eq(0);
    card.onCardPlayed(player, new Virus());
    expect(player.megaCredits).to.eq(2);
  });
});
