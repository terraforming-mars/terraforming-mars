import {expect} from 'chai';
import {PolarIndustries} from '../../../src/server/cards/prelude/PolarIndustries';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('PolarIndustries', () => {
  it('Should play', () => {
    const card = new PolarIndustries();
    const [/* game */, player] = testGame(1);

    const action = card.play(player);

    cast(action, undefined);
    expect(player.production.heat).to.eq(2);
  });
});
