import {expect} from 'chai';
import {GiantSpaceMirror} from '../../../src/server/cards/base/GiantSpaceMirror';
import {TestPlayer} from '../../TestPlayer';

describe('GiantSpaceMirror', function() {
  it('Should play', function() {
    const card = new GiantSpaceMirror();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(3);
  });
});
