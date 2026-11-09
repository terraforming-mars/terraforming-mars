import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {AUTOMA_BASE_MANIFEST} from '@/server/automa/corps/AutomaBaseManifest';
import {trackCubes} from './RecordingMarsBot';

describe('AutomaBaseManifest', () => {
  it('keys each of the twelve corporations by its own name', () => {
    const entries = Object.entries(AUTOMA_BASE_MANIFEST.corps);

    expect(entries).to.have.length(12);
    expect(entries.filter(([name, corp]) => corp.name !== name)).is.empty;
  });

  it('has five corporations with cubes, two of which trigger on every advance', () => {
    const corps = Object.values(AUTOMA_BASE_MANIFEST.corps);

    expect(corps.filter((corp) => trackCubes(corp).length > 0).map((corp) => corp.name))
      .to.have.members([CardName.HELION, CardName.INTERPLANETARY_CINEMATICS, CardName.PHOBOLOG, CardName.TERACTOR, CardName.THORGATE]);
    expect(corps.filter((corp) => corp.trackCubesTriggerEveryAdvance).map((corp) => corp.name))
      .to.have.members([CardName.INTERPLANETARY_CINEMATICS, CardName.TERACTOR]);
  });
});
