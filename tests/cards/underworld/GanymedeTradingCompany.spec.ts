import {expect} from 'chai';
import {GanymedeTradingCompany} from '../../../src/server/cards/underworld/GanymedeTradingCompany';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

describe('GanymedeTradingCompany', () => {
  it('play', () => {
    const card = new GanymedeTradingCompany();
    const [/* game */, player] = testGame(2, {coloniesExtension: true});

    expect(player.colonies.getFleetSize()).eq(1);

    cast(card.play(player), undefined);

    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 3}));
    expect(player.underworldData.corruption).eq(1);
    expect(player.colonies.getFleetSize()).eq(2);
  });
});
