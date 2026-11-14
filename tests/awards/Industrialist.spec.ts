import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Industrialist} from '@/server/awards/Industrialist';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';
import {testGame} from '../TestGame';

describe('Industrialist', () => {
  it('scores a player by steel plus steel and energy production mid game', () => {
    const [, player] = testGame(2);
    player.steel = 3;
    player.production.override({steel: 2, energy: 1});

    expect(new Industrialist().getScore(player)).to.eq(6);
  });

  it('MarsBot scores its Energy track plus 5', () => {
    const marsBot = fakeMarsBot();
    setTrack(marsBot, Tag.POWER, 3);

    expect(new Industrialist().marsBotScore(marsBot)).eq(8);
  });
});
