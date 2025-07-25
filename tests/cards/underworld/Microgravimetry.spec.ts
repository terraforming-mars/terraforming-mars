import {expect} from 'chai';
import {Microgravimetry} from '../../../src/server/cards/underworld/Microgravimetry';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsClaimAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';

describe('Microgravimetry', () => {
  let card: Microgravimetry;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Microgravimetry();
    [game, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);
  });

  it('canAct', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.false;
    player.energy = 2;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.energy = 2;
    cast(card.action(player), undefined);

    expect(player.energy).eq(0);

    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());

    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());

    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());

    runAllActions(game);
    assertIsClaimAction(player, player.popWaitingFor());

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
