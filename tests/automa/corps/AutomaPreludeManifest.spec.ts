import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {AUTOMA_PRELUDE_MANIFEST} from '@/server/automa/corps/AutomaPreludeManifest';
import {trackCubes} from './RecordingMarsBot';

describe('AutomaPreludeManifest', () => {
  it('keys each of the sixteen corporations by its own name', () => {
    const entries = Object.entries(AUTOMA_PRELUDE_MANIFEST.corps);

    expect(entries).to.have.length(16);
    expect(entries.filter(([name, corp]) => corp.name !== name)).is.empty;
  });

  it('has nine corporations with cubes, one of which triggers on every advance', () => {
    const corps = Object.values(AUTOMA_PRELUDE_MANIFEST.corps);

    expect(corps.filter((corp) => trackCubes(corp, [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]).length > 0).map((corp) => corp.name)).to.have.members([
      CardName.CHEUNG_SHING_MARS,
      CardName.POINT_LUNA,
      CardName.VALLEY_TRUST,
      CardName.ASTRODRILL,
      CardName.FACTORUM,
      CardName.MANUTECH,
      CardName.ECOTEC,
      CardName.KUIPER_COOPERATIVE,
      CardName.PALLADIN_SHIPPING,
    ]);
    expect(corps.filter((corp) => corp.trackCubesTriggerEveryAdvance).map((corp) => corp.name)).deep.eq([CardName.FACTORUM]);
  });
});
