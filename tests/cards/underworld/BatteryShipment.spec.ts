import {expect} from 'chai';
import {BatteryShipment} from '../../../src/server/cards/underworld/BatteryShipment';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

describe('BatteryShipment', () => {
  it('play', () => {
    const card = new BatteryShipment();
    const [/* game */, player] = testGame(2);

    cast(card.play(player), undefined);

    expect(player.production.asUnits()).deep.eq(Units.of({energy: 2}));
    expect(player.stock.asUnits()).deep.eq(Units.of({energy: 12}));
  });
});
