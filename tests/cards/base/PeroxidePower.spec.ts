import {expect} from 'chai';
import {PeroxidePower} from '../../../src/server/cards/base/PeroxidePower';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('PeroxidePower', () => {
  it('Should play', () => {
    const card = new PeroxidePower();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.energy).to.eq(2);
  });
});
