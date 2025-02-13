import {expect} from 'chai';
import {SmeltingPlant} from '../../../src/server/cards/prelude/SmeltingPlant';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('SmeltingPlant', () => {
  it('Should play', () => {
    const [game, player] = testGame(1);
    const card = new SmeltingPlant();
    cast(card.play(player), undefined);
    expect(player.steel).to.eq(5);
    expect(game.getOxygenLevel()).to.eq(2);
  });
});
