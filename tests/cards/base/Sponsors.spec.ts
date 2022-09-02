
import {expect} from 'chai';
import {Sponsors} from '../../../src/server/cards/base/Sponsors';
import {TestPlayer} from '../../TestPlayer';

describe('Sponsors', function() {
  it('Should play', function() {
    const card = new Sponsors();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
  });
});
