import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Biofuels} from '../../../src/server/cards/prelude/Biofuels';
import {cast} from '../../TestingUtils';

describe('Biofuels', function() {
  it('Should play', function() {
    const card = new Biofuels();
    const [/* skipped */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(1);
    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(2);
  });
});
