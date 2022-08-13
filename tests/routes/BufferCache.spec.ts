import {expect} from 'chai';

import {BufferCache} from '../../src/server/routes/BufferCache';

describe('BufferCache', function() {
  it('sets with hash', function() {
    const cache = new BufferCache();
    cache.set('foo', Buffer.from('hello world', 'utf8'));
    const result = cache.get('foo');
    expect(result).not.to.be.undefined;
    expect(result?.hash).to.eq('5eb63bbbe01eeed093cb22bb8f5acdc3');
  });
});
