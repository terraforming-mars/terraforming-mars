import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {EarlyColonization} from '../../../src/server/cards/prelude2/EarlyColonization';
import {assertBuildColony} from '../../colonies/coloniesAssertions';

describe('EarlyColonization', () => {
  let player: TestPlayer;
  let card: EarlyColonization;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {coloniesExtension: true});
    card = new EarlyColonization();
  });

  it('play', () => {
    const game = player.game;
    game.colonies[2].colonies.push(player.id);

    expect(game.colonies.map((c) => c.trackPosition)).deep.eq([1, 1, 1, 1]);

    card.play(player);

    expect(game.colonies.map((c) => c.trackPosition)).deep.eq([3, 3, 3, 3]);
    expect(player.energy).eq(3);
    assertBuildColony(player, game.deferredActions.pop()!.execute());
  });
});
