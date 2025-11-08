
import {expect} from 'chai';
import {TowingAComet} from '../../../src/server/cards/base/TowingAComet';
import {testGame} from '../../TestGame';

describe('TowingAComet', () => {
  it('Should play', () => {
    const card = new TowingAComet();
    const [game, player] = testGame(2);
    card.play(player);
    expect(player.plants).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
