import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {GiantSpaceMirror} from '../../../src/server/cards/base/GiantSpaceMirror';

describe('GiantSpaceMirror', function() {
  it('Should play', function() {
    const card = new GiantSpaceMirror();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(3);
  });
});
