import {expect} from 'chai';
import {GiantSpaceMirror} from '../../../src/cards/base/GiantSpaceMirror';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('GiantSpaceMirror', function() {
  it('Should play', function() {
    const card = new GiantSpaceMirror();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
  });
});
