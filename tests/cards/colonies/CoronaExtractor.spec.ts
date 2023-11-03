import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CoronaExtractor} from '../../../src/server/cards/colonies/CoronaExtractor';
import {cast} from '../../TestingUtils';

describe('CoronaExtractor', function() {
  it('Should play', function() {
    const card = new CoronaExtractor();
    const [/* game */, player] = testGame(1);
    expect(player.simpleCanPlay(card)).is.not.true;
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(4);
  });
});
