import {expect} from 'chai';
import {FueledGenerators} from '../../../src/server/cards/base/FueledGenerators';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('FueledGenerators', function() {
  it('Should play', function() {
    const card = new FueledGenerators();
    const player = TestPlayer.BLUE.newPlayer();

    player.production.add(Resources.PLANTS, 1);
    player.simplePlay(card);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.energy).to.eq(1);
  });
});
