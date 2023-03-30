import {expect} from 'chai';
import {DeepWellHeating} from '../../../src/server/cards/base/DeepWellHeating';
import {testGame} from '../../TestGame';

describe('DeepWellHeating', function() {
  it('Should play', function() {
    const card = new DeepWellHeating();
    const [game, player] = testGame(2);
    const action = player.playCard(card);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(game.getTemperature()).to.eq(-28);
  });
});
