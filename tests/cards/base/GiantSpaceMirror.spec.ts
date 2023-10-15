import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GiantSpaceMirror} from '../../../src/server/cards/base/GiantSpaceMirror';
import {cast} from '../../TestingUtils';

describe('GiantSpaceMirror', function() {
  it('Should play', function() {
    const card = new GiantSpaceMirror();
    const [/* skipped */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(3);
  });
});
