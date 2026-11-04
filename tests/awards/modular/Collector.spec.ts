import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Collector} from '@/server/awards/modular/Collector';
import {fakeMarsBot, setAllTracks, setTrack} from '../../automa/FakeMarsBot';
import {testGame} from '../../TestGame';

describe('Collector', () => {
  it('scores a player by distinct resource types', () => {
    const [, player] = testGame(2);
    player.megaCredits = 3;
    player.steel = 1;
    player.heat = 2;

    expect(new Collector().getScore(player)).to.eq(3);
  });

  it('MarsBot counts its tracks that reached space 3', () => {
    const bot = fakeMarsBot();
    setAllTracks(bot, 2);
    setTrack(bot, Tag.BUILDING, 3);
    setTrack(bot, Tag.SPACE, 3);
    setTrack(bot, Tag.PLANT, 7);

    expect(new Collector().marsBotScore(bot)).eq(3);
  });
});
