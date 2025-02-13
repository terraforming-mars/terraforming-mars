import {expect} from 'chai';
import {GHGImportFromVenus} from '../../../src/server/cards/venusNext/GHGImportFromVenus';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('GHGImportFromVenus', () => {
  it('Should play', () => {
    const card = new GHGImportFromVenus();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    expect(player.production.heat).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
