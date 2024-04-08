import {expect} from 'chai';

import {TunnelBoringMachine} from '../../../src/server/cards/underworld/TunnelBoringMachine';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('TunnelBoringMachine', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: TunnelBoringMachine;

  beforeEach(() => {
    [game, player] = testGame(1, {underworldExpansion: true});
    card = new TunnelBoringMachine();
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    expect(card.play(player)).is.undefined;
  });

  it('can act', () => {
    player.energy = 2;
    expect(card.canAct(player)).is.false;
    player.energy = 3;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.energy = 3;

    expect(card.action(player)).is.undefined;
    runAllActions(game);

    expect(player.energy).eq(0);
    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });
});
