import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Blacksmith} from '../../../src/server/awards/modular/Blacksmith';
import {TestPlayer} from '../../TestPlayer';

describe('Blacksmith', () => {
  let award: Blacksmith;
  let player: TestPlayer;

  it('Counts production', () => {
    award = new Blacksmith();
    [/* game */, player] = testGame(2);
    expect(award.getScore(player)).to.eq(0);

    player.production.override({steel: 1, titanium: 1, heat: 1});
    expect(award.getScore(player)).to.eq(2);

    player.production.override({steel: 2, titanium: 1, plants: 3, energy: 7, heat: 2});
    expect(award.getScore(player)).to.eq(3);

    player.production.override({megacredits: 1, steel: 1});
    expect(award.getScore(player)).to.eq(1);

    player.production.override({megacredits: -1, steel: 5, heat: 2});
    expect(award.getScore(player)).to.eq(5);
  });
});
