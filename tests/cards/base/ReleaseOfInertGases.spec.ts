import {expect} from 'chai';
import {ReleaseOfInertGases} from '../../../src/server/cards/base/ReleaseOfInertGases';
import {testGame} from '../../TestGame';

describe('ReleaseOfInertGases', function() {
  it('Should play', function() {
    const card = new ReleaseOfInertGases();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(22);
  });
});
