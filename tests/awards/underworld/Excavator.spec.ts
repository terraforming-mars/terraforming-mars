import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Excavator} from '../../../src/server/awards/underworld/Excavator';
import {TestPlayer} from '../../TestPlayer';

describe('Excavator', () => {
  let award: Excavator;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Excavator();
    [/* game */, player] = testGame(2, {underworldExpansion: true});
  });

  it('getScore', () => {
    expect(award.getScore(player)).eq(0);

    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
    expect(award.getScore(player)).eq(1);

    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: true});
    expect(award.getScore(player)).eq(2);

    player.underworldData.tokens.push({token: 'nothing', shelter: true, active: false});
    expect(award.getScore(player)).eq(3);
  });
});
