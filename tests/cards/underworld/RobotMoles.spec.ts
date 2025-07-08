import {expect} from 'chai';
import {RobotMoles} from '../../../src/server/cards/underworld/RobotMoles';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsClaimAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';

describe('RobotMoles', () => {
  it('canPlay', () => {
    const card = new RobotMoles();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new RobotMoles();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);
    expect(player.steel).eq(2);

    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsClaimAction(player, player.popWaitingFor());
    cast(player.popWaitingFor(), undefined);
  });
});
