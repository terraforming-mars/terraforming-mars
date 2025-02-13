import {ProtectedHabitats} from '../../../src/server/cards/base/ProtectedHabitats';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('ProtectedHabitats', () => {
  it('Should play', () => {
    const card = new ProtectedHabitats();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);

    // TODO(kberg): Add a useful test.
  });
});
