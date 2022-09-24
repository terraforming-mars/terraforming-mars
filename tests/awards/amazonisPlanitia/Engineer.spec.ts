import {expect} from 'chai';
import {fail} from 'assert';
import {Game} from '../../../src/server/Game';
import {Engineer} from '../../../src/server/awards/amazonisPlanitia/Engineer';
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
    player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
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

  it('verify if production cards list is accurate', () => {
    const cardFinder = new CardFinder();
    for (const cardName of Engineer.productionCards) {
      const card = cardFinder.getCardByName(cardName)!;
      const behavior = card.behavior;
      if (behavior?.production !== undefined) {
        fail(`${cardName} shouldn't be on this list.`);
      }
    }
  });
});
