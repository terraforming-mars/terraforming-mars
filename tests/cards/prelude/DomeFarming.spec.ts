import {expect} from 'chai';
import {DomeFarming} from '../../../src/server/cards/prelude/DomeFarming';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('DomeFarming', function() {
  it('Should play', function() {
    const card = new DomeFarming();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.plants).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});
