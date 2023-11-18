import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {LunarSteel} from '../../../src/server/cards/moon/LunarSteel';

describe('LunarSteel', () => {
  let player: TestPlayer;
  let card: LunarSteel;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new LunarSteel();
  });

  it('play', () => {
    expect(player.getSteelValue()).to.eq(2);
    card.play(player);
    expect(player.getSteelValue()).to.eq(3);
  });
});

