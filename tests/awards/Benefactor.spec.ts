import {expect} from 'chai';
import {Benefactor} from '@/server/awards/Benefactor';
import {testGame} from '../TestGame';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Benefactor', () => {
  it('MarsBot scores its TR minus 15, but not below 0', () => {
    for (const run of [
      {terraformRating: 22, expected: 7},
      {terraformRating: 10, expected: 0},
    ]) {
      const [, player] = testGame(1);
      player.setTerraformRating(run.terraformRating);
      const bot = {...fakeMarsBot(), player};

      expect(new Benefactor().marsBotScore(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
