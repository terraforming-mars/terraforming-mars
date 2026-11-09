import {expect} from 'chai';
import {AUTOMA_VENUS_MANIFEST} from '@/server/automa/corps/AutomaVenusManifest';

describe('AutomaVenusManifest', () => {
  it('keys each of the five corporations by its own name', () => {
    const entries = Object.entries(AUTOMA_VENUS_MANIFEST.corps);

    expect(entries).to.have.length(5);
    expect(entries.filter(([name, corp]) => corp.name !== name)).is.empty;
  });
});
