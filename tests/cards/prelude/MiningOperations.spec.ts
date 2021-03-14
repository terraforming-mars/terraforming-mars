import {expect} from 'chai';
import {MiningOperations} from '../../../src/cards/prelude/MiningOperations';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MiningOperations', function() {
  it('Should play', function() {
    const card = new MiningOperations();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
    expect(player.steel).to.eq(4);
  });
});
