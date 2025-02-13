import {expect} from 'chai';
import {ReleaseOfInertGases} from '../../../src/server/cards/base/ReleaseOfInertGases';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('ReleaseOfInertGases', () => {
  it('Should play', () => {
    const card = new ReleaseOfInertGases();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.getTerraformRating()).to.eq(22);
  });
});
