import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Manufacturer} from '../../../src/server/awards/modular/Manufacturer';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '@/common/cards/Tag';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('Manufacturer', () => {
  let award: Manufacturer;
  let player: TestPlayer;

  it('Counts production', () => {
    award = new Manufacturer();
    [/* game */, player] = testGame(2);
    expect(award.getScore(player)).to.eq(0);

    player.production.override({steel: 1, titanium: 1, heat: 1});
    expect(award.getScore(player)).to.eq(2);

    player.production.override({steel: 2, titanium: 1, plants: 3, energy: 7, heat: 2});
    expect(award.getScore(player)).to.eq(4);

    player.production.override({megacredits: 1, steel: 1});
    expect(award.getScore(player)).to.eq(1);

    player.production.override({megacredits: -1, steel: 5, heat: 2});
    expect(award.getScore(player)).to.eq(7);
  });

  it('MarsBot scores its Building and Energy tracks combined', () => {
    const marsBot = fakeMarsBot();
    setTrack(marsBot, Tag.BUILDING, 3);
    setTrack(marsBot, Tag.POWER, 2);

    expect(new Manufacturer().marsBotScore(marsBot)).eq(5);
  });
});
