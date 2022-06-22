import {expect} from 'chai';
import {CoreMine} from '../../src/cards/moon/CoreMine';
import {ResearchNetwork} from '../../src/cards/prelude/ResearchNetwork';
import {FullMoon} from '../../src/moon/FullMoon';
import {TestPlayers} from '../TestPlayers';

describe('FullMoon', () => {
  it('Standard test', () => {
    const award = new FullMoon();
    const player = TestPlayers.BLUE.newPlayer();
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
    const player = TestPlayers.BLUE.newPlayer();
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
