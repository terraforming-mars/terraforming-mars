import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Sponsors} from '../../../src/server/cards/base/Sponsors';
import {cast} from '../../TestingUtils';

describe('Sponsors', function() {
  it('Should play', function() {
    const card = new Sponsors();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(2);
  });
});
