import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {BESPOKE_PRODUCTION_CARDS, AmazonisEngineer} from '../../../src/server/awards/amazonisPlanitia/AmazonisEngineer';
import {TestPlayer} from '../../TestPlayer';
import {newCard} from '../../../src/server/createCard';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {DarksideMiningSyndicate} from '../../../src/server/cards/moon/DarksideMiningSyndicate';
import {SpecializedSettlement} from '../../../src/server/cards/pathfinders/SpecializedSettlement';

describe('AmazonisEngineer', () => {
  let award: AmazonisEngineer;
  let player: TestPlayer;

  beforeEach(() => {
    award = new AmazonisEngineer();
    [/* game */, player] = testGame(2);
  });

  it('score', () => {
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

  for (const cardName of BESPOKE_PRODUCTION_CARDS) {
    it('verify manual card ' + cardName, () => {
      const card = newCard(cardName);
      if (card === undefined) {
        console.log('Skipping ' + cardName);
        return;
      }
      expect(AmazonisEngineer.autoInclude(card), 'This card is manually listed but is automatically identified.').to.be.false;
    });
  }
});
