import {expect} from 'chai';
import * as utils from '../../../src/common/utils/utils';

describe('utils', function() {
  it('range', () => {
    expect(utils.range(10)).deep.eq([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('intersection', () => {
    expect(utils.intersection([], [])).is.empty;
    expect(utils.intersection([1], [2, 3])).is.empty;
    expect(utils.intersection([1, 2, 3], [2, 3])).contains.members([2, 3]);
    expect(utils.intersection([1, 2, 3], [1, 3, 4, 2])).contains.members([2, 3]);
  });

  it('hasIntersection', () => {
    expect(utils.hasIntersection([], [])).is.false;
    expect(utils.hasIntersection([1], [2, 3])).is.false;
    expect(utils.hasIntersection([1, 2, 3], [2, 3])).is.true;
    expect(utils.hasIntersection([1, 2, 3], [1, 3, 4, 2])).is.true;
  });

  it('inplaceRemove', () => {
    const array = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    utils.inplaceRemove(array, 'Tuesday');
    expect(array).deep.eq(['Monday', 'Wednesday', 'Thursday', 'Friday']);

    utils.inplaceRemove(array, 'Saturday');
    expect(array).deep.eq(['Monday', 'Wednesday', 'Thursday', 'Friday']);

    utils.inplaceRemove(array, 'Friday');
    expect(array).deep.eq(['Monday', 'Wednesday', 'Thursday']);

    utils.inplaceRemove(array, 'Monday');
    expect(array).deep.eq(['Wednesday', 'Thursday']);
  });

  it('sum', () => {
    expect(utils.sum([1, 3, 4])).eq(8);
    expect(utils.sum([1, 4])).eq(5);
    expect(utils.sum([1, 4, -6])).eq(-1);
  });
});
