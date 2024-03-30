import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {Virus} from '../../../src/server/cards/base/Virus';
import {InterplanetaryCinematics} from '../../../src/server/cards/corporation/InterplanetaryCinematics';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('InterplanetaryCinematics', function() {
  let card: InterplanetaryCinematics;
  let player: TestPlayer;

  beforeEach(function() {
    card = new InterplanetaryCinematics();
    [/* game */, player] = testGame(2);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.stock.steel).to.eq(20);
  });

  it('Has onCardPlayed', function() {
    player.setCorporationForTest(card);
    card.onCardPlayed(player, new Bushes());
    expect(player.stock.megacredits).to.eq(0);
    card.onCardPlayed(player, new Virus());
    expect(player.stock.megacredits).to.eq(2);
  });
});
