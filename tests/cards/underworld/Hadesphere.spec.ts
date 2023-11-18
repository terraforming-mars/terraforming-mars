import {expect} from 'chai';
import {Hadesphere} from '../../../src/server/cards/underworld/Hadesphere';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('Hadesphere', () => {
  let card: Hadesphere;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Hadesphere();
    [game, player] = testGame(1, {underworldExpansion: true});
  });

  it('Should play', () => {
    player.playCorporationCard(card);
    runAllActions(game);

    expect(player.steel).eq(5);
  });

  it('canAct', () => {
    expect(card.canAct(player)).is.true;
  });

  it('First action', () => {
    player.deferInitialAction(card);
    runAllActions(game);

    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('action', () => {
    player.setCorporationForTest(card);

    cast(card.action(player), undefined);
    runAllActions(game);
    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
  });
});
