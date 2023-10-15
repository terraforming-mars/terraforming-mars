import {SubterraneanReservoir} from '../../../src/server/cards/base/SubterraneanReservoir';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('SubterraneanReservoir', function() {
  it('Should play', function() {
    const card = new SubterraneanReservoir();
    const [/* skipped */, player] = testGame(2);
    cast(card.play(player), undefined);
  });
});
