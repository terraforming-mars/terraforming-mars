import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {NitrogenRichAsteroid} from '../../../src/cards/base/NitrogenRichAsteroid';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('NitrogenRichAsteroid', function() {
  it('Should play', function() {
    const card = new NitrogenRichAsteroid();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(23);
    expect(game.getTemperature()).to.eq(-28);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    player.playedCards.push(new Bushes(), new Bushes(), new Bushes());
    card.play(player);
    expect(player.getTerraformRating()).to.eq(26);
    expect(game.getTemperature()).to.eq(-26);
    expect(player.getProduction(Resources.PLANTS)).to.eq(5);
  });
});
