import {expect} from 'chai';
import * as utils from '../../../src/common/utils/utils';

describe('utils', function() {
  it('range', () => {
    expect(utils.range(10)).deep.eq([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
});
