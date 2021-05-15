import {expect} from 'chai';
import {DeferredAction} from '../../src/deferredActions/DeferredAction';
import {DeferredActionsQueue} from '../../src/deferredActions/DeferredActionsQueue';
import {PlayerInputTypes} from '../../src/PlayerInputTypes';
import {TestPlayers} from '../TestPlayers';
import {SelectOption} from '../../src/inputs/SelectOption';

describe('DeferredActionsQueue', () => {
  it('runs actions for player', () => {
    const redPlayer = TestPlayers.RED.newPlayer();
    const bluePlayer = TestPlayers.BLUE.newPlayer();
    const queue = new DeferredActionsQueue();
    const expectedInput = new SelectOption('foo', 'bar', () => undefined);
    queue.push(new DeferredAction(redPlayer, () => expectedInput));
    queue.push(new DeferredAction(bluePlayer, () => undefined));
    let finished = false;
    expect(queue.length).eq(2);
    queue.runAllFor(redPlayer, () => {
      finished = true;
    });
    expect(redPlayer.getWaitingFor()).eq(expectedInput);
    redPlayer.process([[String(PlayerInputTypes.SELECT_OPTION)]]);
    expect(redPlayer.getWaitingFor()).eq(undefined);
    expect(finished).eq(true);
    expect(queue.length).eq(1);
  });
});
