import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Biofuels} from '../../../src/server/cards/prelude/Biofuels';
import {cast} from '../../TestingUtils';

describe('Biofuels', () => {
  it('Should play', () => {
    const card = new Biofuels();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(1);
    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(2);
  });
});
