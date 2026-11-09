import {expect} from 'chai';
import {Benefactor} from '@/server/awards/Benefactor';
import {testGame} from '../TestGame';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Benefactor', () => {
  it('scores a player by terraform rating', () => {
    const [, player] = testGame(2);
    player.setTerraformRating(25);

    expect(new Benefactor().getScore(player)).to.eq(25);
  });

  for (const run of [
    {terraformRating: 22, expected: 7},
    {terraformRating: 10, expected: 0},
  ] as const) {
    it(`MarsBot scores its TR minus 15, but not below 0, ${JSON.stringify(run)}`, () => {
      const [, player] = testGame(1);
      player.setTerraformRating(run.terraformRating);
      const bot = fakeMarsBot({player});

      expect(new Benefactor().marsBotScore(bot)).eq(run.expected);
    });
  }
});
