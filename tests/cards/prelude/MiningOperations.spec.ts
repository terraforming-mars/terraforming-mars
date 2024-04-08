import {expect} from 'chai';
import {MiningOperations} from '../../../src/server/cards/prelude/MiningOperations';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('MiningOperations', function() {
  it('Should play', function() {
    const card = new MiningOperations();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.steel).to.eq(2);
    expect(player.steel).to.eq(4);
  });
});
