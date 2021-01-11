import {expect} from 'chai';
import {BeginnerCorporation} from '../../../src/cards/corporation/BeginnerCorporation';
import {TestPlayers} from '../../TestingUtils';

describe('BeginnerCorporation', function() {
  it('Should play', function() {
    const card = new BeginnerCorporation();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
