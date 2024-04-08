import {expect} from 'chai';
import {Satellites} from '../../../src/server/cards/base/Satellites';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Satellites', function() {
  it('Should play', function() {
    const card = new Satellites();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(1);
    player.tagsForTest = {space: 1};
    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
