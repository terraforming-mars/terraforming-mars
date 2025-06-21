import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CoronaExtractor} from '../../../src/server/cards/colonies/CoronaExtractor';
import {cast} from '../../TestingUtils';

describe('CoronaExtractor', () => {
  it('Should play', () => {
    const card = new CoronaExtractor();
    const [/* game */, player] = testGame(1);
    expect(card.canPlay(player)).is.not.true;
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(4);
  });
});
