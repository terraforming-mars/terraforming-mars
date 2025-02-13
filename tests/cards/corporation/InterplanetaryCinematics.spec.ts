import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {Virus} from '../../../src/server/cards/base/Virus';
import {InterplanetaryCinematics} from '../../../src/server/cards/corporation/InterplanetaryCinematics';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('InterplanetaryCinematics', () => {
  let card: InterplanetaryCinematics;
  let player: TestPlayer;

  beforeEach(() => {
    card = new InterplanetaryCinematics();
    [/* game */, player] = testGame(2);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.steel).to.eq(20);
  });

  it('Has onCardPlayed', () => {
    player.corporations.push(card);
    card.onCardPlayed(player, new Bushes());
    expect(player.megaCredits).to.eq(0);
    card.onCardPlayed(player, new Virus());
    expect(player.megaCredits).to.eq(2);
  });
});
