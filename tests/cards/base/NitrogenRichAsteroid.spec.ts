import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {NitrogenRichAsteroid} from '../../../src/server/cards/base/NitrogenRichAsteroid';
import {testGame} from '../../TestGame';

describe('NitrogenRichAsteroid', function() {
  it('Should play', function() {
    const card = new NitrogenRichAsteroid();
    const [game, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(23);
    expect(game.getTemperature()).to.eq(-28);
    expect(player.production.plants).to.eq(1);
    player.playedCards.push(new Bushes(), new Bushes(), new Bushes());
    card.play(player);
    expect(player.getTerraformRating()).to.eq(26);
    expect(game.getTemperature()).to.eq(-26);
    expect(player.production.plants).to.eq(5);
  });
});
