import {expect} from 'chai';
import {InheritedFortune} from '../../../src/server/cards/underworld/InheritedFortune';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

describe('InheritedFortune', () => {
  it('play', () => {
    const card = new InheritedFortune();
    const [/* skipped */, player] = testGame(2);

    expect(player.underworldData.corruption).eq(0);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).eq(1);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 1}));
    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 10}));
  });
});
