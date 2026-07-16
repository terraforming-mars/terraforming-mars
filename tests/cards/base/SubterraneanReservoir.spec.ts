import {SubterraneanReservoir} from '../../../src/server/cards/base/SubterraneanReservoir';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('SubterraneanReservoir', () => {
  it('Should play', () => {
    const card = new SubterraneanReservoir();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
  });
});
