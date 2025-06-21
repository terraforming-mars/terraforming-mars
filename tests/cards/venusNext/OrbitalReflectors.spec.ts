import {expect} from 'chai';
import {OrbitalReflectors} from '../../../src/server/cards/venusNext/OrbitalReflectors';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('OrbitalReflectors', () => {
  it('Should play', () => {
    const card = new OrbitalReflectors();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.production.heat).to.eq(2);
  });
});
