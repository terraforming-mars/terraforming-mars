import {expect} from 'chai';
import {byKey, comparing, compound, maxBy, minBy, numeric, reversed} from '@/common/utils/Ordering';

type Party = {name: string, delegates: number};

const parties: ReadonlyArray<Party> = [
  {name: 'reds', delegates: 3},
  {name: 'greens', delegates: 5},
  {name: 'kelvinists', delegates: 5},
  {name: 'unity', delegates: 1},
];

describe('Ordering', () => {
  it('numeric', () => {
    expect([0, 1, 2, 10, 11].toSorted(numeric)).deep.eq([0, 1, 2, 10, 11]);
    expect([10, 2, 11, 0, 1].toSorted(numeric)).deep.eq([0, 1, 2, 10, 11]);
    expect([-5, 5, 0].toSorted(numeric)).deep.eq([-5, 0, 5]);
  });

  it('numeric, reversed', () => {
    expect([0, 1, 2, 10, 11].toSorted(reversed(numeric))).deep.eq([11, 10, 2, 1, 0]);
  });

  it('comparing, numeric key', () => {
    const sorted = parties.toSorted(comparing((p) => p.delegates));
    expect(sorted.map((p) => p.name)).deep.eq(['unity', 'reds', 'greens', 'kelvinists']);
  });

  it('comparing, string key', () => {
    const sorted = parties.toSorted(comparing((p) => p.name));
    expect(sorted.map((p) => p.name)).deep.eq(['greens', 'kelvinists', 'reds', 'unity']);
  });

  it('comparing preserves the order of equivalent elements', () => {
    const sorted = parties.toSorted(comparing((p) => p.delegates));
    expect(sorted.map((p) => p.name)).contains.members(['greens', 'kelvinists']);
    expect(sorted.indexOf(parties[1])).lessThan(sorted.indexOf(parties[2]));
  });

  it('byKey, numeric key', () => {
    const sorted = parties.toSorted(byKey('delegates'));
    expect(sorted.map((p) => p.name)).deep.eq(['unity', 'reds', 'greens', 'kelvinists']);
  });

  it('byKey, string key', () => {
    const sorted = parties.toSorted(byKey('name'));
    expect(sorted.map((p) => p.name)).deep.eq(['greens', 'kelvinists', 'reds', 'unity']);
  });

  it('byKey composes without an explicit type argument', () => {
    const parties2 = [...parties];
    parties2.sort(reversed(byKey('delegates')));
    expect(parties2.map((p) => p.name)).deep.eq(['greens', 'kelvinists', 'reds', 'unity']);

    parties2.sort(compound(byKey('delegates'), byKey('name')));
    expect(parties2.map((p) => p.name)).deep.eq(['unity', 'reds', 'greens', 'kelvinists']);
  });

  it('reversed', () => {
    const sorted = parties.toSorted(reversed(comparing((p) => p.delegates)));
    expect(sorted.map((p) => p.name)).deep.eq(['greens', 'kelvinists', 'reds', 'unity']);
  });

  it('compound', () => {
    const comparator = compound<Party>(
      reversed(comparing((p) => p.delegates)),
      comparing((p) => p.name),
    );
    const sorted = parties.toSorted(comparator);
    expect(sorted.map((p) => p.name)).deep.eq(['greens', 'kelvinists', 'reds', 'unity']);
  });

  it('compound falls through to later comparators', () => {
    const comparator = compound<Party>(
      comparing((p) => p.delegates),
      reversed(comparing((p) => p.name)),
    );
    const sorted = parties.toSorted(comparator);
    expect(sorted.map((p) => p.name)).deep.eq(['unity', 'reds', 'kelvinists', 'greens']);
  });

  it('compound with no comparators treats everything as equivalent', () => {
    expect(compound<Party>()(parties[0], parties[1])).eq(0);
  });

  it('maxBy', () => {
    expect(maxBy([3, 1, 4, 1, 5], numeric)).eq(5);
    expect(maxBy(parties, comparing((p) => p.delegates))?.name).eq('greens');
  });

  it('maxBy ties go to the earliest element', () => {
    expect(maxBy(parties, comparing((p) => p.delegates))).eq(parties[1]);
    expect(maxBy(parties.toReversed(), comparing((p) => p.delegates))).eq(parties[2]);
  });

  it('maxBy matches the first element of a descending sort', () => {
    const comparator = comparing((p: Party) => p.delegates);
    expect(maxBy(parties, comparator)).eq(parties.toSorted(reversed(comparator))[0]);
  });

  it('maxBy of an empty array', () => {
    expect(maxBy([], numeric)).is.undefined;
  });

  it('minBy', () => {
    expect(minBy([3, 1, 4, 1, 5], numeric)).eq(1);
    expect(minBy(parties, comparing((p) => p.delegates))?.name).eq('unity');
  });

  it('minBy ties go to the earliest element', () => {
    const tied: ReadonlyArray<Party> = [
      {name: 'reds', delegates: 1},
      {name: 'greens', delegates: 1},
      {name: 'unity', delegates: 4},
    ];
    expect(minBy(tied, comparing((p) => p.delegates))).eq(tied[0]);
    expect(minBy(tied.toReversed(), comparing((p) => p.delegates))).eq(tied[1]);
  });

  it('minBy matches the first element of an ascending sort', () => {
    const comparator = comparing((p: Party) => p.delegates);
    expect(minBy(parties, comparator)).eq(parties.toSorted(comparator)[0]);
  });

  it('minBy of an empty array', () => {
    expect(minBy([], numeric)).is.undefined;
  });
});
