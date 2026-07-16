import {MultiSet} from 'mnemonist';
import {fail} from 'assert';
import {CardName} from '../../../src/common/cards/CardName';
import {getEnumStringEntries, getEnumStringValues, intersection} from '../../../src/common/utils/utils';
import {GlobalEventName} from '../../../src/common/turmoil/globalEvents/GlobalEventName';
import {expect} from 'chai';

describe('CardName', () => {
  it('No duplicate card names', () => {
    const counts = new MultiSet<string>();
    const map: Array<[string, CardName]> = [];
    const errors: Array<string> = [];

    for (const [enumName, cardName] of getEnumStringEntries(CardName)) {
      map.push([enumName, cardName]);
      counts.add(cardName);
    }
    counts.forEachMultiplicity((count, readableName) => {
      if (count > 1) {
        map.forEach(([enumName, cardName]) => {
          if (cardName === readableName) {
            errors.push(`${enumName} => ${readableName}`);
          }
        });
      }
    });
    if (errors.length > 0) {
      fail('Duplicate card names found\n' + errors.join('\n'));
    }
  });

  it('Conflicts between cards names and global event names', () => {
    const globalEvents = getEnumStringValues(GlobalEventName);
    const cards = getEnumStringValues(CardName);
    // Sad. Not empty. Yet.
    expect(intersection(globalEvents, cards as Array<string>)).deep.eq([
      'Asteroid Mining',
      'Interplanetary Trade',
      'Sabotage',
    ]);
  });
});
