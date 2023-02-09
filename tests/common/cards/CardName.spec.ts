import {MultiSet} from 'mnemonist';
import {fail} from 'assert';
import {CardName} from '../../../src/common/cards/CardName';

describe('CardName', () => {
  it('No duplicate card names', () => {
    const counts = new MultiSet<string>();
    const map: Array<[string, string]> = [];
    const errors: Array<string> = [];

    for (const name in CardName) {
      if (Object.prototype.hasOwnProperty.call(CardName, name)) {
        const text = (<any>CardName)[name];
        map.push([name, text]);
        counts.add(text);
      }
    }
    counts.forEachMultiplicity((count, readableName) => {
      if (count > 1) {
        map.forEach(([cardName, readable]) => {
          if (readable === readableName) {
            errors.push(`${cardName} => ${readableName}`);
          }
        });
      }
    });
    if (errors.length > 0) {
      fail('Duplicate card names found\n' + errors.join('\n'));
    }
  });
});

