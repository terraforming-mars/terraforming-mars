import {Multiset} from '../../../src/server/utils/Multiset';
import {fail} from 'assert';
import {CardName} from '../../../src/common/cards/CardName';

describe('CardName', () => {
  it('No duplicate card names', () => {
    const counts: Multiset<string> = new Multiset();
    const map: Array<[string, string]> = [];
    const errors: Array<string> = [];

    for (const name in CardName) {
      if (Object.prototype.hasOwnProperty.call(CardName, name)) {
        const text = (<any>CardName)[name];
        map.push([name, text]);
        counts.add(text);
      }
    }
    const filtered = counts.entries().filter((count: [string, number]) => {
      // count[0] = Enum String.
      // count[1] = times that Enum String occurs.
      const invalid = count[1] > 1;
      if (invalid) {
        const text = count[0];

        // e[0] is ENUM_NAME and e[1] is Enum String.
        map.filter((e) => e[1] === text)
          .forEach((e) => errors.push(`${e[0]} => ${e[1]}`));
      }
      return invalid;
    });
    if (filtered.length > 0) {
      fail('Duplicate card names found\n' + errors.join('\n'));
    }
  });
});

