import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {BESPOKE_PRODUCTION_CARDS, Engineer} from '../../../src/server/awards/amazonisPlanitia/Engineer';
import {TestPlayer} from '../../TestPlayer';
import {CardFinder} from '../../../src/server/CardFinder';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {DarksideMiningSyndicate} from '../../../src/server/cards/moon/DarksideMiningSyndicate';

describe('Engineer', () => {
  let award: Engineer;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Engineer();
    [/* game */, player] = testGame(2);
  });

  it('score', () => {
    player.playedCards = [];
    expect(award.getScore(player)).eq(0);
    player.playedCards.push(new Tardigrades());
    expect(award.getScore(player)).eq(0);
    player.playedCards.push(new MicroMills());
    expect(award.getScore(player)).eq(1);
    player.playedCards.push(new Cartel());
    expect(award.getScore(player)).eq(2);
    player.playedCards.push(new DarksideMiningSyndicate());
    expect(award.getScore(player)).eq(3);
  });

  // A good way to prevent future failures is to duplicate the Robotic Workforce style of test.
  it('verify if production cards list is accurate', () => {
    const failures: Array<string> = [];
    const cardFinder = new CardFinder();
    for (const cardName of BESPOKE_PRODUCTION_CARDS) {
      const card = cardFinder.getCardByName(cardName)!;
      if (Engineer.autoInclude(card)) {
        failures.push(cardName);
      }
    }
    expect(failures, failures.toString()).has.length(0);
  });
});
