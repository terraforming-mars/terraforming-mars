import {expect} from 'chai';
import {NitrogenRichAsteroid} from '../../../src/server/cards/base/NitrogenRichAsteroid';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('NitrogenRichAsteroid', () => {
  it('Should play', () => {
    const card = new NitrogenRichAsteroid();
    const [game, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.getTerraformRating()).to.eq(23);
    expect(game.getTemperature()).to.eq(-28);
    expect(player.production.plants).to.eq(1);
    player.tagsForTest = {plant: 3};
    card.play(player);
    expect(player.getTerraformRating()).to.eq(26);
    expect(game.getTemperature()).to.eq(-26);
    expect(player.production.plants).to.eq(5);
  });
});
