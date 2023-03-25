import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GiantSpaceMirror} from '../../../src/server/cards/base/GiantSpaceMirror';

describe('GiantSpaceMirror', function() {
  it('Should play', function() {
    const card = new GiantSpaceMirror();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(3);
  });
});
