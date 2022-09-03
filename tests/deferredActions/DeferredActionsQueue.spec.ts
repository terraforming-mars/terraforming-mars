import {expect} from 'chai';
import {SimpleDeferredAction} from '../../src/server/deferredActions/DeferredAction';
import {DeferredActionsQueue} from '../../src/server/deferredActions/DeferredActionsQueue';
import {PlayerInputType} from '../../src/common/input/PlayerInputType';
import {TestPlayer} from '../TestPlayer';
import {SelectOption} from '../../src/server/inputs/SelectOption';

describe('DeferredActionsQueue', () => {
  it('runs actions for player', () => {
    const redPlayer = TestPlayer.RED.newPlayer();
    const bluePlayer = TestPlayer.BLUE.newPlayer();
    const queue = new DeferredActionsQueue();
    const expectedInput = new SelectOption('foo', 'bar', () => undefined);
    queue.push(new SimpleDeferredAction(redPlayer, () => expectedInput));
    queue.push(new SimpleDeferredAction(bluePlayer, () => undefined));
    let finished = false;
    expect(queue.length).eq(2);
    queue.runAllFor(redPlayer, () => {
      finished = true;
    });
    expect(redPlayer.getWaitingFor()).eq(expectedInput);
    redPlayer.process([[String(PlayerInputType.SELECT_OPTION)]]);
    expect(redPlayer.getWaitingFor()).eq(undefined);
    expect(finished).eq(true);
    expect(queue.length).eq(1);
  });
});
