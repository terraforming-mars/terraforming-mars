import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Botanist} from '@/server/awards/arabiaTerra/Botanist';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';
import {Resource} from '@/common/Resource';
import {testGame} from '../../TestGame';

describe('Botanist', () => {
  it('scores a player by plant production', () => {
    const [, player] = testGame(2);
    player.production.add(Resource.PLANTS, 4);

    expect(new Botanist().getScore(player)).to.eq(4);
  });

  for (const run of [
    {position: 6, expected: 4},
    {position: 0, expected: -2},
  ] as const) {
    it('MarsBot scores its Bio track minus 2, even below 0: ' + JSON.stringify(run), () => {
      const marsBot = fakeMarsBot();
      setTrack(marsBot, Tag.PLANT, run.position);

      expect(new Botanist().marsBotScore(marsBot)).eq(run.expected);
    });
  }
});
