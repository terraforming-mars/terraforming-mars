import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {BESPOKE_PRODUCTION_CARDS, Engineer} from '../../../src/server/awards/amazonisPlanitia/Engineer';
import {TestPlayer} from '../../TestPlayer';
import {newCard} from '../../../src/server/createCard';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {DarksideMiningSyndicate} from '../../../src/server/cards/moon/DarksideMiningSyndicate';
import {SpecializedSettlement} from '../../../src/server/cards/pathfinders/SpecializedSettlement';

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
    player.playedCards.push(new SpecializedSettlement());
    expect(award.getScore(player)).eq(4);
  });

  // A good way to prevent future failures is to duplicate the Robotic Workforce style of test.
  it('verify if production cards list is accurate', () => {
    const failures = [];
    for (const cardName of BESPOKE_PRODUCTION_CARDS) {
      const card = newCard(cardName)!;
      if (Engineer.autoInclude(card)) {
        failures.push(cardName);
      }
    }
    expect(failures, failures.toString()).has.length(0);
  });
});
