import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CoronaExtractor} from '../../../src/server/cards/colonies/CoronaExtractor';

describe('CoronaExtractor', function() {
  it('Should play', function() {
    const card = new CoronaExtractor();
    const [, player] = testGame(1);
    expect(player.simpleCanPlay(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(4);
  });
});
