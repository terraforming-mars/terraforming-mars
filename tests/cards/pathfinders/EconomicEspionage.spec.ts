import {expect} from 'chai';
import {EconomicEspionage} from '../../../src/server/cards/pathfinders/EconomicEspionage';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';

describe('EconomicEspionage', () => {
  let card: EconomicEspionage;
  let player: TestPlayer;

  beforeEach(() => {
    card = new EconomicEspionage();
    [/* game */, player] = testGame(2);
    player.playedCards.push(card);
  });

  it('can act', () => {
    player.megaCredits = 1;

    expect(card.canAct(player)).is.false;

    player.megaCredits = 2;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.megaCredits = 2;

    card.action(player);
    runAllActions(player.game);
    expect(player.megaCredits).eq(0);
    expect(card.resourceCount).eq(1);
  });

  it('victoryPoints', () => {
    card.resourceCount = 2;
    expect(card.getVictoryPoints(player)).eq(0);

    card.resourceCount = 3;
    expect(card.getVictoryPoints(player)).eq(1);

    card.resourceCount = 5;
    expect(card.getVictoryPoints(player)).eq(1);

    card.resourceCount = 6;
    expect(card.getVictoryPoints(player)).eq(2);
  });
});
