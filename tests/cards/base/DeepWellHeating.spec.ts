import {expect} from 'chai';
import {DeepWellHeating} from '../../../src/server/cards/base/DeepWellHeating';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('DeepWellHeating', () => {
  it('Should play', () => {
    const card = new DeepWellHeating();
    const [game, player] = testGame(2);
    const action = player.playCard(card);
    cast(action, undefined);
    expect(player.production.energy).to.eq(1);
    expect(game.getTemperature()).to.eq(-28);
  });
});
