import {expect} from 'chai';
import {DomeFarming} from '../../../src/server/cards/prelude/DomeFarming';
import {TestPlayer} from '../../TestPlayer';

describe('DomeFarming', function() {
  it('Should play', function() {
    const card = new DomeFarming();
    const player = TestPlayer.BLUE.newPlayer();
    const action = player.simplePlay(card);
    expect(action).is.undefined;
    expect(player.production.plants).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});
