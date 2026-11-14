import {expect} from 'chai';
import {AUTOMA_TURMOIL_MANIFEST} from '@/server/automa/corps/AutomaTurmoilManifest';

describe('AutomaTurmoilManifest', () => {
  it('keys each of the five corporations by its own name', () => {
    const entries = Object.entries(AUTOMA_TURMOIL_MANIFEST.corps);

    expect(entries).to.have.length(5);
    expect(entries.filter(([name, corp]) => corp.name !== name)).is.empty;
  });
});
