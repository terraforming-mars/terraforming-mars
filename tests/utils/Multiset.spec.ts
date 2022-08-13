import {expect} from 'chai';
import {Multiset} from '../../src/server/utils/Multiset';

describe('Multiset', function() {
  it('sanity', function() {
    const ms: Multiset<String> = new Multiset();
    expect(ms.get('a')).is.undefined;
    ms.add('a');

    expect(ms.get('a')).eq(1);
    expect(ms.entries()).eql([['a', 1]]);

    ms.add('a');
    expect(ms.get('a')).eq(2);
    expect(ms.entries()).eql([['a', 2]]);

    ms.add('b');
    expect(ms.entries()).eql([['a', 2], ['b', 1]]);
  });
});
