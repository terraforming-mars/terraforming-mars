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

  // todo: test for isUnits

  it('isEmpty', () => {
    expect(Units.isEmpty({})).is.true;
    expect(Units.isEmpty(Units.EMPTY)).is.true;
    expect(Units.isEmpty(Units.negative(Units.EMPTY))).is.true;
    expect(Units.isEmpty({steel: 0})).is.true;
    expect(Units.isEmpty({steel: 1})).is.false;
  });

  it('negative', () => {
    expect(Units.negative(Units.EMPTY)).deep.eq(Units.EMPTY);
    expect(Units.negative(Units.of({
      megacredits: -2,
      steel: -1,
      titanium: 0,
      plants: 1,
      energy: 2,
      heat: 3,
    }))).deep.eq(Units.of({
      megacredits: 2,
      steel: 1,
      titanium: 0,
      plants: -1,
      energy: -2,
      heat: -3,
    }));
  });

  it('partial', () => {
    expect(Units.partial({})).deep.eq({});
    expect(Units.partial({megacredits: 0})).deep.eq({});
    expect(Units.partial({megacredits: undefined})).deep.eq({});
    expect(Units.partial({megacredits: 1})).deep.eq({megacredits: 1});
    expect(Units.partial({megacredits: -1})).deep.eq({megacredits: -1});
  });
});
