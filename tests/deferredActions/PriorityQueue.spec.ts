import {expect} from 'chai';
import {PriorityQueue} from '../../src/server/deferredActions/PriorityQueue';
import {Priority} from '../../src/server/deferredActions/Priority';

describe('PriorityQueue', () => {
  let queue: PriorityQueue<string, string>;

  beforeEach(() => {
    queue = new PriorityQueue();
  });

  it('empty queue', () => {
    expect(queue).has.length(0);
    expect(queue.pop()).is.undefined;
    expect(queue.peek()).is.undefined;
  });

  it('pop returns highest priority', () => {
    queue.push('default', Priority.DEFAULT, 'a');
    queue.push('cost', Priority.COST, 'a');

    expect(queue.pop()).eq('cost');
    expect(queue.pop()).eq('default');
    expect(queue.pop()).is.undefined;
  });

  it('equal priority comes out in insertion order', () => {
    queue.push('first', Priority.DEFAULT, 'a');
    queue.push('second', Priority.DEFAULT, 'a');
    queue.push('third', Priority.DEFAULT, 'a');

    expect(queue.pop()).eq('first');
    expect(queue.pop()).eq('second');
    expect(queue.pop()).eq('third');
  });

  it('pop with key returns highest priority for that key', () => {
    queue.push('a-default', Priority.DEFAULT, 'a');
    queue.push('b-cost', Priority.COST, 'b');
    queue.push('a-cost', Priority.COST, 'a');

    expect(queue.pop('a')).eq('a-cost');
    expect(queue.pop('a')).eq('a-default');
    expect(queue.pop('a')).is.undefined;
    expect(queue).has.length(1);
  });

  it('pop with unmatched key leaves the queue unchanged', () => {
    queue.push('a', Priority.DEFAULT, 'a');

    expect(queue.pop('b')).is.undefined;
    expect(queue).has.length(1);
    expect(queue.peek()).eq('a');
  });

  it('peek does not remove', () => {
    queue.push('default', Priority.DEFAULT, 'a');
    queue.push('cost', Priority.COST, 'a');

    expect(queue.peek()).eq('cost');
    expect(queue.peek()).eq('cost');
    expect(queue).has.length(2);
  });

  it('length tracks pushes and pops', () => {
    queue.push('one', Priority.DEFAULT, 'a');
    queue.push('two', Priority.DEFAULT, 'b');
    expect(queue).has.length(2);

    queue.pop('b');
    expect(queue).has.length(1);

    queue.pop();
    expect(queue).has.length(0);
  });
});
