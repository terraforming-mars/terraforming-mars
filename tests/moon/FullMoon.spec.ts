import {expect} from 'chai';
import {CoreMine} from '../../src/server/cards/moon/CoreMine';
import {ResearchNetwork} from '../../src/server/cards/prelude/ResearchNetwork';
import {FullMoon} from '../../src/server/moon/FullMoon';
import {TestPlayer} from '../TestPlayer';

describe('FullMoon', () => {
  it('Standard test', () => {
    const award = new FullMoon();
    const player = TestPlayer.BLUE.newPlayer();
    expect(award.getScore(player)).eq(0);
    player.playedCards = [
      new CoreMine(),
    ];
    expect(award.getScore(player)).eq(1);
    player.playedCards = [
      new CoreMine(),
      new CoreMine(),
    ];
    expect(award.getScore(player)).eq(2);
  });

  it('Wild tag does not count', () => {
    const award = new FullMoon();
    const player = TestPlayer.BLUE.newPlayer();
    player.playedCards = [
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
    ];
    expect(award.getScore(player)).eq(5);
    player.playedCards.push(new ResearchNetwork());
    expect(award.getScore(player)).eq(5);
  });
});
