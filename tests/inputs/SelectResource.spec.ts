import {expect} from 'chai';
import {SelectResource} from '../../src/server/inputs/SelectResource';

describe('SelectResource', () => {
  let selected: string | undefined;

  beforeEach(() => {
    selected = undefined;
  });

  function cb(x: string) {
    selected = x;
    return undefined;
  }

  it('Simple', () => {
    const selectResource = new SelectResource('').andThen(cb);
    expect(selectResource.include).deep.eq(['megacredits', 'steel', 'titanium', 'plants', 'energy', 'heat']);
    selectResource.process({type: 'resource', resource: 'plants'});
    expect(selected).eq('plants');
    expect(selectResource.selected).eq('plants');
  });

  it('limited set', () => {
    const selectResource = new SelectResource('', ['heat', 'plants']).andThen(cb);
    expect(selectResource.include).deep.eq(['heat', 'plants']);
    selectResource.process({type: 'resource', resource: 'heat'});
    expect(selected).eq('heat');
    expect(selectResource.selected).eq('heat');
  });

  it('Not a resource', () => {
    const selectResource = new SelectResource('').andThen(cb);
    expect(() => selectResource.process({type: 'resource', resource: 'eggs' as any})).to.throw(/Not a valid unit/);
    expect(selected).is.undefined;
  });

  it('Not a valid resource', () => {
    const selectResource = new SelectResource('', ['megacredits', 'titanium']).andThen(cb);
    expect(() => selectResource.process({type: 'resource', resource: 'steel'})).to.throw(/Not a valid unit/);
    expect(selected).is.undefined;
  });
});
