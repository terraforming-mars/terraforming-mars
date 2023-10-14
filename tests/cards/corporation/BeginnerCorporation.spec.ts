import {BeginnerCorporation} from '../../../src/server/cards/corporation/BeginnerCorporation';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('BeginnerCorporation', function() {
  it('Should play', function() {
    const card = new BeginnerCorporation();
    const [/* skipped */, player] = testGame(2);
    cast(card.play(player), undefined);
  });
});
