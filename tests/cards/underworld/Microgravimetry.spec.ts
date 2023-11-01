import {expect} from 'chai';
import {Microgravimetry} from '../../../src/server/cards/underworld/Microgravimetry';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

describe('Microgravimetry', () => {
  let card: Microgravimetry;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Microgravimetry();
    [game, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);
  });

  it('canAct - no energy', () => {
    expect(card.canAct(player)).is.false;
    player.energy = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action: 1 energy', () => {
    player.energy = 1;
    const selectAmount = cast(card.action(player), SelectAmount);
    selectAmount.cb(1);
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).eq(1);
  });

  it('action: 3 energy', () => {
    player.energy = 4;
    const selectAmount = cast(card.action(player), SelectAmount);
    selectAmount.cb(3);
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).eq(3);
  });
});
