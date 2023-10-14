import {GreatAquifer} from '../../../src/server/cards/prelude/GreatAquifer';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('GreatAquifer', function() {
  it('Should play', function() {
    const card = new GreatAquifer();
    const [/* skipped */, player] = testGame(2);
    cast(card.play(player), undefined);
  });
});
