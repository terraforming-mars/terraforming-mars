import {expect} from 'chai';
import {Units} from '../../src/common/Units';

describe('Units', () => {
  it('of', () => {
    expect(Units.of({})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({megacredits: 1})).deep.eq({
      megacredits: 1,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({steel: 1})).deep.eq({
      megacredits: 0,
      steel: 1,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({titanium: 1})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 1,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({plants: 1})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 1,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({energy: 1})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 1,
      heat: 0,
    });

    expect(Units.of({heat: 1})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 1,
    });
  });
});
