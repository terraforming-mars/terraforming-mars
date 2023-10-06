import {expect} from 'chai';
import {SimpleDeferredAction} from '../../src/server/deferredActions/DeferredAction';
import {DeferredActionsQueue} from '../../src/server/deferredActions/DeferredActionsQueue';
import {SelectOption} from '../../src/server/inputs/SelectOption';
import {testGame} from '../TestGame';

describe('DeferredActionsQueue', () => {
  it('runs actions for player', () => {
    const [, player, otherPlayer] = testGame(2);

    const queue = new DeferredActionsQueue();
    const expectedInput = new SelectOption('foo', 'bar');
    queue.push(new SimpleDeferredAction(player, () => expectedInput));
    queue.push(new SimpleDeferredAction(otherPlayer, () => undefined));
    let finished = false;
    expect(queue.length).eq(2);
    queue.runAllFor(player, () => {
      finished = true;
    });
    expect(player.getWaitingFor()).eq(expectedInput);
    player.process({type: 'option'});
    expect(player.getWaitingFor()).eq(undefined);
    expect(finished).eq(true);
    expect(queue.length).eq(1);
  });
});
