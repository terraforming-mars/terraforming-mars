import {expect} from 'chai';
import {Benefactor} from '../../src/server/awards/Benefactor';
import {testGame} from '../TestGame';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';

describe('Benefactor', () => {
  const award = new Benefactor();

  it('scores a player by terraform rating', () => {
    const [, player] = testGame(2);
    player.setTerraformRating(25);

    expect(award.getScore(player)).to.eq(25);
  });

  it('scores MarsBot by its terraform rating minus 15', () => {
    const [, player] = testGame(2);
    player.setTerraformRating(25);
    const bot = {player} as unknown as IMarsBot;

    expect(award.marsBotScore(bot)).to.eq(10);

    player.setTerraformRating(10);
    expect(award.marsBotScore(bot)).to.eq(0);
  });
});
