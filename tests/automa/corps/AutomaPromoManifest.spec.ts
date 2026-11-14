import {expect} from 'chai';
import {AUTOMA_PROMO_MANIFEST} from '@/server/automa/corps/AutomaPromoManifest';

describe('AutomaPromoManifest', () => {
  it('keys each of the four corporations by its own name', () => {
    const entries = Object.entries(AUTOMA_PROMO_MANIFEST.corps);

    expect(entries).to.have.length(4);
    expect(entries.filter(([name, corp]) => corp.name !== name)).is.empty;
  });
});
