import {GreatAquifer} from '../../../src/server/cards/prelude/GreatAquifer';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('GreatAquifer', () => {
  it('Should play', () => {
    const card = new GreatAquifer();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
  });
});
