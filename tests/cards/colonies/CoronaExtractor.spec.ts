import {expect} from 'chai';
import {CoronaExtractor} from '../../../src/server/cards/colonies/CoronaExtractor';
import {TestPlayer} from '../../TestPlayer';

describe('CoronaExtractor', function() {
  it('Should play', function() {
    const card = new CoronaExtractor();
    const player = TestPlayer.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(4);
  });
});
