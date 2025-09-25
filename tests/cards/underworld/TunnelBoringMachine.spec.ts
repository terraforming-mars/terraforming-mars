import {expect} from 'chai';

import {TunnelBoringMachine} from '../../../src/server/cards/underworld/TunnelBoringMachine';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';

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
    cast(card.play(player), undefined);
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
    assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });
});
