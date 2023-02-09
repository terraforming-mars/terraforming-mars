import {expect} from 'chai';
import {SimpleDeferredAction} from '../../src/server/deferredActions/DeferredAction';
import {DeferredActionsQueue} from '../../src/server/deferredActions/DeferredActionsQueue';
import {SelectOption} from '../../src/server/inputs/SelectOption';
import {getTestPlayer, newTestGame} from '../TestGame';

describe('DeferredActionsQueue', () => {
  it('runs actions for player', () => {
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    const otherPlayer = getTestPlayer(game, 1);

    const queue = new DeferredActionsQueue();
    const expectedInput = new SelectOption('foo', 'bar', () => undefined);
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
