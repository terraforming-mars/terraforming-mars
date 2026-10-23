import {expect} from 'chai';
import {SimpleDeferredAction} from '../../src/server/deferredActions/DeferredAction';
import {DeferredActionsQueue} from '../../src/server/deferredActions/DeferredActionsQueue';
import {SelectOption} from '../../src/server/inputs/SelectOption';
import {testGame} from '../TestGame';
import {IPlayer} from '../../src/server/IPlayer';
import {PlayerInput} from '../../src/server/PlayerInput';
import {Priority} from '../../src/server/deferredActions/Priority';

describe('DeferredActionsQueue', () => {
  it('runs actions for player', () => {
    const [/* game */, player, otherPlayer] = testGame(2);

    const queue = new DeferredActionsQueue();
    const expectedInput = new SelectOption('foo', 'bar');
    queue.push(new SimpleDeferredAction(player, () => expectedInput));
    queue.push(new SimpleDeferredAction(otherPlayer, () => undefined));
    let finished = false;
    expect(queue).has.length(2);
    queue.runAllFor(player, () => {
      finished = true;
    });
    expect(player.getWaitingFor()).eq(expectedInput);
    player.process({type: 'option'});
    expect(player.getWaitingFor()).eq(undefined);
    expect(finished).eq(true);
    expect(queue).has.length(1);
  });

  // Each action appends its name to `log` when it runs.
  function logAction(player: IPlayer, log: Array<string>, name: string, priority?: Priority, input?: PlayerInput) {
    return new SimpleDeferredAction(player, () => {
      log.push(name);
      return input;
    }, priority);
  }

  it('runs actions added mid-run, higher priority first', () => {
    const [/* game */, player] = testGame(1);
    const queue = new DeferredActionsQueue();
    const log: Array<string> = [];
    queue.push(new SimpleDeferredAction(player, () => {
      log.push('a');
      queue.push(new SimpleDeferredAction(player, () => {
        log.push('cost');
        queue.push(logAction(player, log, 'chained'));
        return undefined;
      }, Priority.COST));
      return undefined;
    }));
    queue.push(logAction(player, log, 'b'));
    let finishedCount = 0;

    queue.runAll(() => finishedCount++);

    expect(log).deep.eq(['a', 'cost', 'b', 'chained']);
    expect(finishedCount).eq(1);
    expect(queue).has.length(0);
  });

  it('runAllFor leaves other players actions in place', () => {
    const [/* game */, player, otherPlayer] = testGame(2);
    const queue = new DeferredActionsQueue();
    const log: Array<string> = [];
    queue.push(logAction(otherPlayer, log, 'other', Priority.COST));
    queue.push(logAction(player, log, 'a'));
    queue.push(logAction(player, log, 'b'));
    let finished = false;

    queue.runAllFor(player, () => {
      finished = true;
    });

    expect(log).deep.eq(['a', 'b']);
    expect(finished).eq(true);
    expect(queue).has.length(1);
    expect(queue.peek()?.player).eq(otherPlayer);
  });

  it('runAllFor with no actions for player', () => {
    const [/* game */, player, otherPlayer] = testGame(2);
    const queue = new DeferredActionsQueue();
    const log: Array<string> = [];
    queue.push(logAction(otherPlayer, log, 'other'));
    let finished = false;

    queue.runAllFor(player, () => {
      finished = true;
    });

    expect(log).is.empty;
    expect(finished).eq(true);
    expect(queue).has.length(1);
  });

  it('runAll pauses for input, then runs the rest including actions added by the response', () => {
    const [/* game */, player] = testGame(1);
    const queue = new DeferredActionsQueue();
    const log: Array<string> = [];
    const input = new SelectOption('foo', 'bar').andThen(() => {
      log.push('responded');
      queue.push(logAction(player, log, 'added'));
      return undefined;
    });
    queue.push(logAction(player, log, 'first'));
    queue.push(logAction(player, log, 'asks', undefined, input));
    queue.push(logAction(player, log, 'b'));
    let finishedCount = 0;

    queue.runAll(() => finishedCount++);

    expect(log).deep.eq(['first', 'asks']);
    expect(player.getWaitingFor()).eq(input);
    expect(finishedCount).eq(0);
    expect(queue).has.length(1);

    player.process({type: 'option'});

    expect(log).deep.eq(['first', 'asks', 'responded', 'b', 'added']);
    expect(finishedCount).eq(1);
    expect(queue).has.length(0);
  });

  it('runAllFor does not run a higher-priority action it adds for another player', () => {
    const [/* game */, player, otherPlayer] = testGame(2);
    const queue = new DeferredActionsQueue();
    const log: Array<string> = [];
    queue.push(new SimpleDeferredAction(player, () => {
      log.push('a');
      queue.push(logAction(otherPlayer, log, 'other', Priority.COST));
      return undefined;
    }));
    queue.push(logAction(player, log, 'b'));
    let finished = false;

    queue.runAllFor(player, () => {
      finished = true;
    });

    expect(log).deep.eq(['a', 'b']);
    expect(finished).eq(true);
    expect(queue).has.length(1);
    expect(queue.peek()?.player).eq(otherPlayer);
  });
});
