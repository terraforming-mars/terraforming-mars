import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GiantSpaceMirror} from '../../../src/server/cards/base/GiantSpaceMirror';
import {cast} from '../../TestingUtils';

describe('GiantSpaceMirror', () => {
  it('Should play', () => {
    const card = new GiantSpaceMirror();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(3);
  });
});
