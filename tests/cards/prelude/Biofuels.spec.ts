import {expect} from 'chai';
import {Biofuels} from '../../../src/server/cards/prelude/Biofuels';
import {TestPlayer} from '../../TestPlayer';

describe('Biofuels', function() {
  it('Should play', function() {
    const card = new Biofuels();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(2);
  });
});
