import {expect} from 'chai';
import {PeroxidePower} from '../../../src/server/cards/base/PeroxidePower';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('PeroxidePower', function() {
  it('Should play', function() {
    const card = new PeroxidePower();
    const [/* skipped */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.energy).to.eq(2);
  });
});
