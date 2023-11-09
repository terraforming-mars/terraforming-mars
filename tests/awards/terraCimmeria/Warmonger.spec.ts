import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Warmonger} from '../../../src/server/awards/terraCimmeria/Warmonger';
import {TestPlayer} from '../../TestPlayer';
import {CardFinder} from '../../../src/server/CardFinder';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {TheDarksideofTheMoonSyndicate} from '../../../src/server/cards/moon/TheDarksideofTheMoonSyndicate';

describe('Warmonger', () => {
  let award: Warmonger;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Warmonger();
    [/* game */, player] = testGame(2);
  });

  it('score', () => {
    player.playedCards = [];
    expect(award.getScore(player)).eq(0);
    player.playedCards.push(new Tardigrades());
    expect(award.getScore(player)).eq(0);
    player.playedCards.push(new Ants());
    expect(award.getScore(player)).eq(1);
    player.playedCards.push(new BigAsteroid());
    expect(award.getScore(player)).eq(2);
    player.corporations.push(new TheDarksideofTheMoonSyndicate());
    expect(award.getScore(player)).eq(3);
  });

  // A good way to prevent future failures is to duplicate the Robotic Workforce style of test.
  it('verify if attack cards list is accurate', () => {
    const failures: Array<string> = [];
    const cardFinder = new CardFinder();
    for (const cardName of Warmonger.attackCards) {
      const card = cardFinder.getCardByName(cardName);
      // TODO(kberg): Remove === undefined by 2024-02-01
      if (card === undefined) {
        console.log('Skipping ' + cardName);
        continue;
      }
      if (Warmonger.autoInclude(card)) {
        failures.push(cardName);
      }
    }
    expect(failures, failures.toString()).has.length(0);
  });
});
