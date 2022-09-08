import {expect} from 'chai';
import {MartianInsuranceGroup} from '../../../src/server/cards/pathfinders/MartianInsuranceGroup';
import {TestPlayer} from '../../TestPlayer';
import {newTestGame, TestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {fakeCard} from '../../TestingUtils';
import {CardType} from '../../../src/common/cards/CardType';

describe('MartianInsuranceGroup', function() {
  let card: MartianInsuranceGroup;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: TestGame;

  beforeEach(function() {
    card = new MartianInsuranceGroup();
    game = newTestGame(2);
    [player, player2] = game.testPlayers;
    player.setCorporationForTest(card);
  });

  it('when you play an event', function() {
    const event = fakeCard({name: 'A' as CardName, cardType: CardType.EVENT});
    expect(player.production.megacredits).eq(0);
    expect(player2.production.megacredits).eq(0);
    player.playCard(event);
    expect(player.production.megacredits).eq(1);
    expect(player2.production.megacredits).eq(0);
  });

  it('when opponent plays an event', function() {
    const event = fakeCard({name: 'A' as CardName, cardType: CardType.EVENT});
    expect(player.production.megacredits).eq(0);
    expect(player2.production.megacredits).eq(0);
    player2.playCard(event);
    expect(player.production.megacredits).eq(0);
    expect(player2.production.megacredits).eq(0);
  });
});
