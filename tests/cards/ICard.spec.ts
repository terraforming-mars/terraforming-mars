import {expect} from 'chai';
import {FocusedOrganization} from '../../src/server/cards/prelude2/FocusedOrganization';
import {isIActionCard} from '../../src/server/cards/ICard';
import {MicroMills} from '../../src/server/cards/base/MicroMills';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {MercurianAlloys} from '../../src/server/cards/promo/MercurianAlloys';
import {EcoLine} from '../../src/server/cards/corporation/EcoLine';
import {SeptumTribus} from '../../src/server/cards/turmoil/SeptumTribus';

describe('ICard', () => {
  const runs = [
    {description: 'automated card', card: new MicroMills(), expected: false},
    {description: 'blue card with active effect', card: new Tardigrades(), expected: true},
    {description: 'blue card with passive effect', card: new MercurianAlloys(), expected: false},
    {description: 'corporation with active effect', card: new SeptumTribus(), expected: true},
    {description: 'corporation with passive effect', card: new EcoLine(), expected: false},
    {description: 'prelude with active effect', card: new FocusedOrganization(), expected: true},
  ] as const;
  for (const run of runs) {
    it('isIActionCard - ' + run.description, () => {
      expect(isIActionCard(run.card)).eq(run.expected);
    });
  }
});
