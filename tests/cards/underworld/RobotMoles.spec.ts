import {expect} from 'chai';
import {RobotMoles} from '../../../src/server/cards/underworld/RobotMoles';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('RobotMoles', () => {
  it('canAct', () => {
    const card = new RobotMoles();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    expect(card.canAct(player)).is.false;

    player.steel = 1;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new RobotMoles();
    const [game, player] = testGame(2, {underworldExpansion: true});

    player.steel = 1;

    cast(card.action(player), undefined);

    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).eq(1);
    expect(player.steel).eq(0);
  });
});
